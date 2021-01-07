import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'couriers': 'Haydovchilar',
  'parks': 'Parkovkalar',
  'dashboard': 'Dashbord',
  'logout': 'Chiqish',
  'login': 'Kirish',
  'username': 'Foydalanuvchi nomi',
  'password': 'Maxfiy kod',
  'search': 'Qidirish',
  'list': "Ro'yxat",
  'action': 'Boshqaruv',
  'save': 'Saqlash',
  'add': "Qo'shish",
  'update': "O'zgartirish",
  'delete': "O'chirish",
  'read': "Ko'rish",
  'fillIn': "Maydonlarni to'ldiring",
  'required': 'Majburiy!',
  'selectDate': 'Sanani tanlang',
  'error': "Xatolik sodir bo'ldi",
  'successfullyDeleted': "muvaffaqiyatli o'chirildi",
  'deleteMsg': "Rostdan ham o'chirmoqchimisiz",
  'yes': 'Ha',
  'no': "Yo'q",
  'male': 'Erkak',
  'female': 'Ayol',

  // dashboard
  'driversCount': 'Haydovchilar soni',
  'parksCount': 'Parkovkalar soni',

  // couriers
  'firstName': 'Ism',
  'lastName': 'Familya',
  'phone': 'Telefon raqam',
  'createdAt': "Qo'shilgan sana",
  'status': 'Holati',
  'active': 'Aktiv',
  'blocked': 'Bloklangan',
  'courierInfo': 'Haydovchi malumotlari',
  'address': 'Manzil',
  'gender': 'Jinsi',
  'passportNumber': 'Pasport raqami',
  'lisenseNumber': 'Haydovchilik guvohnomasi raqami',
  'birthDate': "Tug'ilgan sana",
  'lisenseGivenDate': 'Prava berilgan sana',
  'lisenseExpiryDate': 'Prava amal qiladigan sana',
  'block': 'Bloklash',
  'courierblocked': 'Haydovchi bloklandi',
  'unblock': 'Aktivlashtirish',
  'courierUnblocked': 'Haydovchi aktivlashtirildi',
  'phoneExists': 'Telefon raqam mavjud!',
  'incorrectPhone': "Telefon raqam noto'g'ri kiritildi",
  'blockMsg': 'Rostdan ham blocklamoqchimisiz',
  'unblockMsg': 'Rostdan ham aktivlashtirmoqchimisiz',

  // parks
  'parkName': 'Parkovka nomi',
  'location': 'Park lokatsiyasi',
  'parkInfo': 'Parkovka malumotlari'
}

export default {
  ...components,
  ...locale
}
