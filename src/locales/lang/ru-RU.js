import antdRuRU from 'ant-design-vue/es/locale-provider/ru_RU'
import momentRU from 'moment/locale/ru'

const components = {
  antLocale: antdRuRU,
  momentName: 'ru',
  momentLocale: momentRU
}

const locale = {
  message: '-',
  'menu.home': 'Home',
  'menu.dashboard': 'Приборная панель',
  'menu.dashboard.analysis': 'Анализ',
  'menu.dashboard.monitor': 'Monitor',
  'menu.dashboard.workplace': 'Рабочее место',
  'layouts.usermenu.dialog.title': 'Выйти',
  'layouts.usermenu.dialog.content': 'Вы действительно хотите выйти?',
  // general
  enterSystem: 'Войти в систему',
  directory: 'Справочник',
  contentPages: 'Контент сервис',
  personal_settings: 'Личный кабинет',
  catalog: 'Каталог',
  product_kind: 'Тип продукта',
  measures: 'Измерении',
  couriers: 'Курьеры',
  news: 'Новости',
  promos: 'Акции и Скидки',
  c1: '1C',
  attribute: 'Атрибуты товаров',
  'update-prices': 'Обновить цены',
  'update-quantity': 'Oбновить количество',
  parks: 'Автостоянки',
  clients: 'Клиенты',
  client: 'Клиент',
  dashboard: 'Дашборд',
  logout: 'Выход',
  login: 'Вход',
  username: 'Логин',
  password: 'Пароль',
  passwordMatchError: 'Пароли не соответствуют',
  search: 'Поиск',
  list: 'Список',
  action: 'Действия',
  save: 'Сохранить',
  reset: 'Сбросить',
  add: 'Добавить',
  showOnMap: 'Показать на карте',
  update: 'Изменить',
  delete: 'Удалить',
  read: 'Посмотреть',
  parameter: 'Параметры',
  fillIn: 'Заполните поля',
  required: 'Обязательное!',
  requiredField: 'Пожалуйста, заполните необходимые поля',
  selectDate: 'Выберите дату',
  error: 'Произошла ошибка',
  successfullyDeleted: 'Успешно удален',
  successfullyUpdated: 'Успешно обновлено',
  successfullyAdded: 'Успешно добавлено',
  successfullyUploaded: 'Успешно загружен',
  deleteMsg: 'Вы действительно хотите удалить это?',
  yes: 'Да',
  no: 'Нет',
  male: 'Мужской',
  female: 'Женский',
  park: 'Парковке',
  prices: 'Цены',
  old_price: 'Старая цена',
  selectPark: 'Выберите парковке',
  description: 'Описание',
  characteristics: 'Характеристики',
  confirm: 'Подтвердить',
  confirmPassword: 'Подтвердить пароль',
  enterNumber: 'Введите цифры',
  uploadUserPicture: 'Загрузить изображение пользователя',
  numberCopied: 'Номер был скопирован',
  noEnteredClient: 'Введенный клиент будет добавлен как новый клиент',
  invalidNumber: 'Неправильный номер',
  greeting: 'Здравствуйте',
  welcome: 'Добро пожаловать!',
  images: 'Изображений',
  image: 'Изображение',
  preview_image: 'Preview',
  noImage: 'Нет изображения',
  preview: 'Предварительный просмотр',
  full_text: 'Текст',
  area: 'Регион',
  meta_title: 'Заголовок',
  meta_tags: 'Meta Keywords',
  meta_description: 'Описание',
  uploadImage: 'Загрузить изображение',
  uploadVideo: 'Загрузить видео',
  uploadPreviewImage: 'Загрузить preview',
  url: 'URL',
  title: 'Название',
  phone_number: 'Телефонный номер',
  date: 'Дата',
  customers: 'Клиенты',
  customer: 'Клиент',
  map: 'Карта',
  size: 'Размер',
  pages: 'Страницы',
  content: 'Содержание',
  permissions: 'Разрешения',
  key: 'Ключ',
  admins: 'Пользователи',
  adminstrators: 'Пользователи',
  activity: 'Действие',
  activities: 'Действия',
  backToList: 'Вернуться к списку',
  minLength: 'Пароль должен содержать не менее 4 символов',
  start_time: 'Начальное время',
  end_time: 'Время окончания',
  not_available: 'Недоступно',
  // banner
  bannerPositions: 'Позиции баннеров',
  banners: 'Баннеры',
  bannerPosition: 'Позиция баннера',
  // dashboard
  sum_stat: 'Статистика суммы заказов',
  orders_stat: 'Статистика по заказам',
  clients_stat: 'Статистика новых зарегистрированных клиентов',
  sum_average: 'Среднесуточная сумма заказов',
  orders_average: 'Среднесуточные заказы',
  clients_average: 'Среднесуточные новые клиенты',
  // couriers
  firstName: 'Имя',
  lastName: 'Фамилия',
  phone: 'Номер',
  createdAt: 'Дата добавления',
  status: 'Статус',
  active: 'Активный',
  inactive: 'Неактивный',
  blocked: 'Заблокирован',
  courierInfo: 'Информация курьер',
  address: 'Адрес',
  address2: 'Адрес',
  gender: 'Пол',
  passportNumber: 'Серия Пасспорта',
  lisenseNumber: 'Номер водительских прав',
  birthDate: 'Дата рождения',
  lisenseGivenDate: 'Дата выдачи',
  lisenseExpiryDate: 'Дата действия',
  block: 'Блок',
  paymentType: 'Виды оплаты',
  courierblocked: 'Водитель заблокирован.',
  unblock: 'Активация',
  courierUnblocked: 'Курьер активирован',
  phoneExists: 'Номер телефона доступен!',
  incorrectPhone: 'Номер телефона введен неправильно!',
  blockMsg: 'Вы действительно хотите заблокировать?',
  unblockMsg: 'Вы действительно хотите активировать?',
  destination: 'Aрентир',

  // parks
  parkName: 'Название парка',
  location: 'Расположение парка',
  parkInfo: 'Информация о парковке',

  // fares
  fares: 'Тарифы',
  fare: 'Тариф',
  delivery_time: 'Срок доставки',
  fare_name: 'Название тарифа',
  min_distance: 'Минимальное расстояние',
  min_price: 'Минимальная цена',
  price_per_km: 'Цена за километр',
  // orders
  order_number: 'Номер заказа',
  delivery_method: 'Способ доставки',
  payment_method: 'Способ оплаты',
  payment_total: 'СУММА ЗАКАЗА',
  order_data: 'Данные заказа',
  orderHistory: 'История заказов',
  customer_name: 'Покупатель',
  note: 'Комментарий к заказу',
  //  attributes
  attribute_create: 'Cоздать атрибут',
  attributes: 'Aтрибуты',
  attribute_type: 'Тип атрибута',
  attr_name: 'Название',
  add_attr: 'Добавить атрибут',
  attr_dublicate: 'дублировать атрибуты',
  option_name: 'Hазвание опции',
  value: 'Cтоимость',
  failedData: 'Неудачная форма данных',
  attr_failed: 'Атрибуты неудачных данных',
  attr_empty: 'Атрибуты не выбраны',
  //
  total: 'Всего',
  name: 'Название',
  quantity: 'Количество',
  customerName: 'Имя клиента',
  customerPhone: 'Телефон клиента',
  deliveryPrice: 'Цена доставки',
  selectStatus: 'Выберите статус',
  orderCountByBranch: 'Количество заказов по филиалам',
  orderEdit: 'Изменить заказ',
  ordersCount: 'Количество заказов',
  createOrder: 'Создать заказ',
  orders: 'Заказы',
  order: 'Заказ',
  order_no: 'Порядковый номер',
  all: 'Все заказы',
  delivered: 'Доставлен',
  finished: 'Завершен',
  new: 'Новый',
  addField: 'Добавить поле',
  operatorAccepted: 'Оператор принял',
  operatorCancelled: 'Оператор отменил',
  branchesAccepted: 'Филиал принял',
  branchesCancelled: 'Филиал отменил',
  branchesReady: ' Филиал подготовил',
  ready: 'Готов',
  courierAccepted: 'Курьер принял',
  courierCancelled: 'Курьер отменил',
  courierPickedUp: 'Курьер взял',
  cancelled: 'Oтменено',
  //
  assignCourier: 'Назначить курьера',
  removeCourier: 'Удалить курьера',
  cancel: 'Отмена',
  searchCourier: 'Поиск курьера',
  totalPrice: 'Итоговая цена',
  orderId: 'Ид.заказа',
  Address: 'Адрес',
  Source: 'Источник',
  // companies
  company_name: 'Название компании',
  fistname: 'имя',
  lastname: 'Фамилия',
  email: 'Адрес электронной почты',
  inn: 'ИНН',
  mfo: 'МФО код',
  emails: 'Электронное письмо',
  //

  branchName: 'Название филиала',
  destinationAddress: 'Адрес назначения',
  place: 'Место',
  successfullyRemoved: 'Успешно отдаленный',
  successfullyAssigned: 'Успешно назначен',
  NoAddress: 'Адреса пока нет',
  clientAddress: 'История адресов клиента',
  home: 'Квартира',
  level: 'Этаж',
  entry: 'Подъезд',
  domophoneNumber: 'Номер домофона',
  createClient: 'Добавить пользователя',
  // news
  news_title: 'Название новости',
  uploadNewsPreviewImage: 'Загрузить preview (Это изображение будет отображаться в списке новостей)',
  // promos
  promo_title: 'Название акции',
  // shops
  shops: 'Mагазины',
  shop_name: 'Название магазина',
  working_hours: 'Pабочее время',
  // category
  categories: 'Категории',
  category: 'Категория',
  additional_categories: 'Дополнительные категории',
  category_name: 'Название категории',
  category_url: 'URL категории',
  uploadCategoryImage: 'Загрузить изображение категории',
  parentCategory: 'Главная категория',
  position: 'Порядковый номер',

  // brands
  brands: 'Бренды',
  brand_name: 'Название бренда',
  brand_url: 'URL бренда',
  brand_picture: 'Изображение бренда',
  uploadBrandImage: 'Загрузить изображение бренда',

  // product
  'featured-products': 'Коллекция продуктов',
  featuredProducts: 'Коллекция продуктов',
  add_product: 'Добавить продукт',
  products: 'Продукты',
  product: 'Продукт',
  product_name: 'Наименование товара',
  product_url: 'URL товара',
  product_price: 'Цена товара',
  product_old_price: 'Старая цена товара',
  unired_price: 'UNIRED цена',
  unired_old_price: 'Старая UNIRED цена',
  product_preview_text: 'Краткая информация',
  product_meta_title: 'Заголовок',
  product_meta_tags: 'Meta Keywords',
  product_external_id: 'Внешний ID',
  product_code: 'Артикул',
  product_meta_description: 'Описание',
  short_name: 'Короткое название',
  code: 'Код',
  brand: 'Бренд ',
  preview_text: 'Предварительный текст',
  selectCategory: 'Выбрать категорию',
  selectMeasure: 'Выберите меру',
  uploadProductImage: 'Загрузить изображения (jpg, png, svg) размер ширина 400px',
  uploadProductGallery: 'Загрузить изображение (jpg, png, svg) размер ширина 150px (галерея)',
  productPicture: 'Изображение товара',
  basicSettings: 'Основные настройки',
  previewProduct: 'Информация о продукте',
  reviews: 'Отзывы',
  comment: 'Комментарий',
  rating: 'Оценка',
  review_edit: 'Форма редактирования отзыва',
  variants: 'Варианты',
  product_variants: 'Варианты продуктов',
  product_variants_list: 'Прайс лист',
  product_variant: 'Вариант продукта',
  // measures
  measure_name: 'Название измерения',
  selectProductKind: 'Выберите вид продукта',

  // companies
  company: 'Компания',
  middelname: 'Второе имя',
  user_type: 'Тип пользователя',
  data_of_birth: 'Дата рождения',
  companies: 'Компании',
  usertypenewadd: 'Тип пользователя новое добавление',
  account_number: 'Номер счета',
  number_of_employees: 'Количество работников',
  auth_api_url_useraAdd: 'компания тип пользователя новое добавить',
  user_type_new_add: 'тип пользователя новое добавление',
  // cities
  cities: 'Города',
  city: 'Город',
  // agents
  agents: 'Агенты',
  counterAgents: 'Контр агенты',
  agent: 'Агент',
  physicalAgents: 'Физические агенты',
  legalAgents: 'Юридические агенты',
  previewAgent: 'Информация об агенте',

  // branches
  branches: 'Филиалы',
  actions: 'Действия',
  updateBranch: 'Обновить информацию о филиале',
  previewBranch: 'Информация о филиале',
  previewCompany: 'Информация о компании',
  addCourier: 'Добавить курьера',
  branchPhone: 'Номер филиала',

  // clients
  updateClient: 'Обновить информацию о клиенте',
  previewClient: 'Информация о клиенте',

  // courier
  updateCourier: 'Обновить информацию о курьере',
  previewCourier: 'Информация о курьере',
  // staff
  staff: 'Сотрудники',
  role: 'Роль',
  roles: 'Роли',
  userType: 'Тип пользователя',
  cashier: 'Кассир',
  manager: 'Менеджер',
  consultant: 'Консультант',
  admin: 'Админ',
  errorPhone: 'Ошибка телефона номера',
  fullname: 'Ф.И.О.',
  validatePassword: 'Пароль должен состоять минимум из 5 символов, 1 цифры, 1 буквы',
  // inventory
  inventory: 'Склад',
  prixod: 'Товары',
  buy_price: 'Цена покупки',
  sell_price: 'Цена продажи',
  phoneInUse: 'Этот номер используется',
  information: 'Информация',
  branchType: 'Тип филиала',
  own: 'Собственный',
  franchise: 'Франшиза',
  color: 'Цвет',

  // inventory-item
  imeiCode: 'IMEI Код',
  sellPrice: 'Цена продажи',
  buyPrice: 'Цена покупки',
  productState: 'Состояние',
  // werhouses
  coming: 'Приход',
  Bartchnumber: 'Номер партии',
  Branch: 'Филиал',
  Provider: 'Поставщик',
  Cashier: 'Поставщик',
  total_amount: 'Общая количество',
  amount: 'Сумма',
  Scanned: 'Сканировано',
  data: 'Дата',
  imei: 'ИМЕИ',
  product_state: 'Состояние',
  typeofinterparas: 'Тип взаимарас',
  price: 'Цена',
  moving: 'Перемещение',
  remainder: 'Остаток',

  // company
  corporates: 'Корпорации',
  corporate: 'Корпорация',
  bank_name: 'Название банка',
  juristicEntity: 'Юридическое лицо',
  warehouse: 'Склад',

  // countries
  countries: 'Страны',
  regions: 'Регионы',
  state: 'Состояние',
  'bar_code': 'Штрих-код',
  importDataFromVariant: 'Импортировать данные из существующего варианта продукта',
  newPriceInput: 'Новая цена (инпут)',
  currentPrice: 'Текущая цена',
  back: 'Назад',
  Currency: 'Валюта',
  dollarCurrency: 'Курс доллара',
  // oreders
  'orederstab2': 'Новый',
  'orederstab3': 'Обработан',
  'orederstab4': 'В пути',
  'orederstab5': 'Завершён',
  // customers
  'customerstab2': 'Контрагенты',
  'customerstab3': 'Поставщики',
  'customerstab4': 'История адресов'

}

export default {
  ...components,
  ...locale
}
