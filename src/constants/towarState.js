const towarState = {
  status: {
    'new': { name: 'новый', color: 'blue' },
    'used': { name: 'Б/У', color: 'grey' },
    'restoration': { name: 'реставрирован', color: 'grey' },
    'defect': { name: 'брак', color: 'red' }
  },
  imstatus: {
'not_registered': { name: 'Не регистрирован,', color: 'blue' },
'will_be_registered': { name: 'Будет зарегистрирован', color: 'blue' },
'registered': { name: 'Регистрирован', color: 'blue' },
'none': { name: 'Не имеется', color: 'blue' }
  }
}
export default towarState
