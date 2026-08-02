export const contactPeople = [
  { phone: '+966 56 667 6600', phoneHref: 'tel:+966566676600', email: 'm.saadi@arzanaco.com', emailHref: 'mailto:m.saadi@arzanaco.com', whatsappHref: 'https://wa.me/966566676600', whatsapp: true },
  { phone: '+966 59 708 048', phoneHref: 'tel:+96659708048', email: 'Moath@arzanaco.com', emailHref: 'mailto:Moath@arzanaco.com', whatsapp: false },
  { phone: '+966 53 063 7156', phoneHref: 'tel:+966530637156', email: 'projects@arzanaco.com', emailHref: 'mailto:projects@arzanaco.com', whatsapp: false },
] as const;

export const companyAddress = {
  lines: ['Servcorp Building #13', 'Laysen Valley Complex', 'Riyadh, Saudi Arabia'],
  linesAr: ['مبنى سيرفكورب رقم 13', 'مجمع ليسن فالي', 'الرياض، المملكة العربية السعودية'],
} as const;
