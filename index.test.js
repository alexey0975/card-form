import { isValidCardNum, isValidCardCvv, createForm } from './src';

test('Валидация номера карты пропускает корректный номер карты', () => {
  expect(isValidCardNum('4874156422321989')).toBe(true);
});
test('Валидация номера карты не пропускает произвольную строку, содержащую любые нецифровые символы', () => {
  expect(isValidCardNum('487vvds422321989')).toBe(false);
  expect(isValidCardNum('487авап422321989')).toBe(false);
  expect(isValidCardNum('487,,..422321989')).toBe(false);
});
test('Валидация номера карты не пропускает строку с недостаточным количеством цифр', () => {
  expect(isValidCardNum('4874156422')).toBe(false);
});
test('Валидация номера карты не пропускает строку со слишком большим количеством цифр', () => {
  expect(isValidCardNum('44874156422222321989')).toBe(false);
});

test('Валидация CVV/CVC пропускает строку с тремя цифровыми символами', () => {
  expect(isValidCardCvv('487')).toBe(true);
});
test('Валидация CVV/CVC не пропускает строки с 1-2 цифровыми символами', () => {
  expect(isValidCardCvv('48')).toBe(false);
  expect(isValidCardCvv('4')).toBe(false);
});
test('Валидация CVV/CVC не пропускает строки с 4+ цифровыми символами', () => {
  expect(isValidCardCvv('48745')).toBe(false);
});
test('Валидация CVV/CVC не пропускает строки с тремя нецифровыми символами', () => {
  expect(isValidCardCvv('vи.')).toBe(false);
});

test('Проверка создания формы с 4-мя полями ввода с плейсхолдерами «Номер карты», «ММ/ГГ», CVV/CVC, Email', () => {
  const form = createForm();
  const inputs = Array.from(form.getElementsByTagName('input'));
  expect(form).toBeInstanceOf(HTMLFormElement);
  expect(inputs).toHaveLength(4);
  expect(inputs).toContain(form.querySelector('[placeholder="Номер карты"]'));
  expect(inputs).toContain(form.querySelector('[placeholder="ММ/ГГ"]'));
  expect(inputs).toContain(form.querySelector('[placeholder="ММ/ГГ"]'));
  expect(inputs).toContain(form.querySelector('[placeholder="Email"]'));
});
