import { el, setChildren } from 'redom';
import { card } from 'creditcards';
import Cleave from 'cleave.js';
import validator from 'validator';
import './styles.css';
import amex from './assets/images/American_Express.svg';
import dankort from './assets/images/dankort.svg';
import diners from './assets/images/Diners_Club.svg';
import discover from './assets/images/Discover_Card.svg';
import jcb from './assets/images/JCB.svg';
import maestro from './assets/images/maestro.svg';
import mastercard from './assets/images/Mastercard.svg';
import mir from './assets/images/Mir.svg';
import uatp from './assets/images/UATP.png';
import unionPay from './assets/images/UnionPay.svg';
import visa from './assets/images/Visa.svg';
import instapayment from './assets/images/instapay.png';

const form = createForm();
setChildren(window.document.body, form);
validateForm();

export function isValidCardNum(value) {
  return card.isValid(value, card.type(value));
}

export function isValidCardDate(month, year) {
  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear() - 2000;
  return Number(month) + Number(year) * 12 > todayMonth + todayYear * 12;
}

export function isValidCardCvv(value) {
  return value.trim().length === 3 && !isNaN(value.trim());
}

export function isValidEmail(value) {
  return validator.isEmail(value);
}

export function createForm() {
  const formEl = el('form.form');
  const dateCvvWrapper = el('div.wrapper');
  const cardNum = el('input.input.', {
    placeholder: 'Номер карты',
    name: 'number',
  });

  const cardLogo = el('span.input__card-logo');

  const cardDate = el('input.input.input_small', {
    placeholder: 'ММ/ГГ',
    name: 'date',
  });

  const cardCvv = el('input.input.input_small', {
    placeholder: 'CVV/CVC',
    autocomplete: 'off',
    type: 'password',
    maxlength: 3,
    name: 'cvv',
  });

  const email = el('input.input', {
    placeholder: 'Email',
    type: 'email',
    name: 'email',
  });

  const submitBtn = el(
    'button.btn',
    {
      type: 'submit',
      disabled: true,
    },
    'Отправить'
  );

  setChildren(dateCvvWrapper, [
    el('label.label', [el('span.field-name', 'Дата:'), cardDate]),
    el('label.label', [el('span.field-name', 'CVV:'), cardCvv]),
  ]);

  setChildren(formEl, [
    el('label.label', [
      el('span.field-name', 'Номер карты:'),
      cardLogo,
      cardNum,
    ]),
    dateCvvWrapper,
    el('label.label', [el('span.field-name', 'Ваш email:'), email]),
    submitBtn,
  ]);

  new Cleave(cardNum, {
    creditCard: true,
    creditCardStrictMode: true,
    onCreditCardTypeChanged: function (type) {
      const cardLogos = {
        amex: amex,
        dankort: dankort,
        diners: diners,
        discover: discover,
        jcb: jcb,
        maestro: maestro,
        mastercard: mastercard,
        mir: mir,
        uatp: uatp,
        unionPay: unionPay,
        visa: visa,
        instapayment: instapayment,
      };
      for (const logo in cardLogos) {
        if (logo === type) {
          cardLogo.style.backgroundImage = `url(${cardLogos[logo]})`;
          return;
        }
        cardLogo.style.backgroundImage = null;
      }
    },
  });

  new Cleave(cardDate, {
    date: true,
    datePattern: ['m', 'y'],
  });

  cardCvv.addEventListener('keypress', (event) => {
    if (isNaN(event.key) || event.key === ' ') event.preventDefault();
  });

  submitBtn.addEventListener('click', (e) => e.preventDefault());

  return formEl;
}

function validateForm() {
  const submitBtn = form.querySelector('.btn');
  const inputs = Array.from(form.getElementsByTagName('input'));

  inputs.forEach((input) => {
    input._valid = false;

    input.addEventListener('focus', () => {
      submitBtn.disabled = true;
      input.classList.remove('error');
      if (input.nextElementSibling) input.nextElementSibling.remove();
    });

    input.addEventListener('blur', () => {
      try {
        if (input.value.trim().length === 0)
          throw new TypeError('Введите значение');

        if (input.name === 'number') {
          const cardNumValid = isValidCardNum(input.value.split(' ').join(''));
          if (!cardNumValid) throw new TypeError('Введен неверный номер карты');
        }

        if (input.name === 'date') {
          const [month, year] = input.value.split('/');
          const cardDateValid = isValidCardDate(month, year);
          if (!cardDateValid) throw new TypeError('Срок действия карты истек');
        }

        if (input.name === 'cvv') {
          const cvvValid = isValidCardCvv(input.value);
          if (!cvvValid) throw new TypeError('Введите 3 символа');
        }

        if (input.name === 'email' && !isValidEmail(input.value))
          throw new TypeError('Email должен быть в формате name@example.com');

        input._valid = true;
      } catch (error) {
        if (error.name !== 'TypeError') throw error;
        addErrorMessage(input, error);
      } finally {
        submitBtn.disabled = isValidForm(form);
      }
    });
  });
}

function addErrorMessage(inputEl, error) {
  const errMessage = el('span.error__message', error.message);
  inputEl.classList.add('error');
  inputEl._valid = false;
  inputEl.after(errMessage);
}

function isValidForm(form) {
  for (const element of form.elements) {
    if (element.classList.contains('btn')) continue;
    if (!element._valid) return true;
  }
  return false;
}
