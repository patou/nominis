const moment = require('moment');

const {formatDate, startBy, fete, getDate, getName, nameExist, dateExist} = require('./functions');

test('formatDate', () => {
  expect(formatDate(moment())).toBe("aujourd'hui");
  expect(formatDate(moment().startOf('day').subtract(1, 'day'))).toBe("hier");
  expect(formatDate(moment().startOf('day').add(1, 'day'))).toBe("demain");
  expect(formatDate(moment("2018-01-01"))).toBe("le 1 janvier");
});

test('startBy', () => {
  expect(startBy('Saint Patrice')).toBe("la Saint Patrice");
});

test('fete', () => {
  expect(fete('0317','Patrice')).toBe("nous fêtons la Saint Patrick");
  expect(fete('0317','Patrick')).toBe("");
});

test('getDate', () => {
  expect(getDate("0317")).toMatchObject({saint:"Saint Patrick"})
})

test('getName', () => {
  expect(getName("patrice")).toMatchObject({id:"patrice",kind:"male", major:"Patrick",date:"0317"})
})

test('nameExist', () => {
  expect(nameExist("patrice")).toBe(true)
  expect(nameExist("toto")).toBe(false)
})

test('dateExist', () => {
  expect(dateExist("0317")).toBe(true)
  expect(dateExist("4242")).toBe(false)
})
