'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Plus, Copy, Check, ExternalLink, Trash2, Edit3, X,
  Lock, KeyRound, Image as ImageIcon, Sparkles, RefreshCw, Smartphone
} from 'lucide-react';

const MASTER_PIN = 'xswQG0fh';

const SECTORS = [
  {
    category: '💈 Erkek Berber & Kuaför',
    images: [
      { label: 'Loş Işık & Deri Koltuk', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Makas & Tezgah Detayı', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Vintage Berber Dükkanı', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tıraş Fırçası & Köpük', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kuaför Lambası & Aynalar', url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💇‍♀️ Kadın Kuaförü & Saç Tasarım',
    images: [
      { label: 'Şık Saç Yıkama Koltukları', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kuaför Aynası & Işıklar', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Profesyonel Saç Fönü & Tarak', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Salon & Kozmetik Tezgahı', url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Saç Boyası & Fırçalar', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '☕ Kafe, Kahve & Tatlı',
    images: [
      { label: 'Espresso Bar & Loş Ambiyans', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşapta Latte Art', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kahve Çekirdekleri & Kavurma', url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Bakır Cezve & Sıcak Kum', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Cam Vitrinde Çikolata & Pasta', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🥩 Restoran, Ocakbaşı & Steak',
    images: [
      { label: 'Lüks Masa & Kadehler', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Izgara & Alev Şovu', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Şık Servis & Koyu Tabak', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Közde Pişen Kebap Şişleri', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Döküm Tavada Mühürlü Et', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🌯 Dönerci & Fast Food',
    images: [
      { label: 'Ateşte Dönen Yaprak Döner', url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Döner Bıçağı & Kesim Tezgâhı', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dumanı Üstünde Dürüm Servisi', url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıkta Izgara Burger & Patates', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Fırından Yeni Çıkan Pide & Lavaş', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🍋 Çiğköfteci & Mezeci',
    images: [
      { label: 'Bakır Tepside Nar Ekşili Çiğköfte', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Yeşillikler & Taze Limon Detayı', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Baharat Çeşitleri & Pul Biber', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Geleneksel Bakır Tabak Sunumu', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taze Lavaş Üzerinde Çiğköfte Dürüm', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🛒 Bakkal, Market & Şarküteri',
    images: [
      { label: 'Ahşap Kasalarda Taze Meyveler', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Geleneksel Şarküteri & Peynir Tezgâhı', url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Ambiyansta Market Rafları', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taş Fırın Ekmeği & Unlu Mamul', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Zeytin & Doğal Gurme Kavanozları', url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🍾 Tekel Bayi & Meşrubat',
    images: [
      { label: 'Işıklı Koyu Viski & Şişe Rafları', url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Şarap Mahzeni Rafları', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Buz Dolu Kovada Şişeler', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Neon Aydınlatmalı Bar & Şişe Tezgâhı', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kadeh & Amber Renkli İçecek Detayı', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🎮 İnternet Cafe & E-Spor',
    images: [
      { label: 'RGB Işıklı Mekanik Klavye & Mouse', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlıkta Kavisli Oyuncu Monitörü', url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Neon Kulaklık Standı & Gamepad', url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıralı Gaming Kasaları & Fan Işıkları', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Konsol Oyun Kolu & Koyu Fon', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '📱 Elektronikçi, Telefon & Tamir',
    images: [
      { label: 'Büyüteç & Anakart Lehim Tamiri', url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Hassas Tornavidalar & Telefon İçi', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıkta Devre Kartı & Çipler', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Akıllı Telefon Ekran Değişim Masası', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Test Cihazları & Dijital Multimetre', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🏠 Emlak Ofisi & Gayrimenkul',
    images: [
      { label: 'Modern Mimar Maketi & Çizim Masası', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Daire Sözleşmesi & Altın Kalem', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Masa & Pirinç Ev Anahtarı', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gece Işıklarında Rezidans & Gökdelen', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Koltuklu Emlak Toplantı Odası', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '📊 Muhasebe & Mali Müşavirlik',
    images: [
      { label: 'Hesap Makinesi, Defter & Dolma Kalem', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Finansal Grafikler & Deri Ajanda', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Yeşil Siperli Masa Lambası & Evraklar', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mühür, Kaşe & Resmi Belgeler', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klasik Ahşap Kütüphane & Hukuk Rafları', url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🚗 Oto Yıkama & Detailing',
    images: [
      { label: 'Petek LED & Siyah Araba Yansıması', url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Seramik Kaplama & Köpük Detayı', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Parlak Siyah Jant & Kaliper Temizliği', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Polisaj Makinesi & Pasta Cila', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Basınçlı Su Tabancası & Işıklar', url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🔧 Oto Tamir, Lastik & Sanayi',
    images: [
      { label: 'Lifte Kaldırılmış Araç Altı Bakımı', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıralı Somun Anahtarları & Alet Duvarı', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Fren Diski & Kaliper Montajı', url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Motor Bloğu & Yağ Değişim Tezgâhı', url: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Parlak Sıfır Lastikler & Jant Balansı', url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💅 Güzellik Merkezi, Tırnak & Spa',
    images: [
      { label: 'Mum Işığı & Doğal Taş Spa', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Estetik & Manikür Odası', url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Cilt Bakım Serumları & Damlalık', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Renkli Oje Şişeleri & UV Lamba', url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Masaj Yağları & Bambu Detayı', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🎨 Dövme (Tattoo) & Sanat',
    images: [
      { label: 'Dövme Makinesi & Odak Işığı', url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Dövme Stüdyosu Masası', url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Siyah Mürekkep Damlaları & İğneler', url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Çizim Eskizleri & Siyah Eldiven', url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Koltuk & Sanatçı Lambası', url: 'https://images.unsplash.com/photo-1590246814883-578358eb09ee?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🦷 Diş Kliniği & Sağlık',
    images: [
      { label: 'Ultra Modern Klinik & Muayene Ünitesi', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Steril Alet Tepsisi & Aynalar', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Minimalist Sağlık Odası & Monitör', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Diş Hekimi Odak Işığı & Koltuk', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Panoramik Diş Röntgen Filmi', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💪 Spor Salonu, Fitness & Gym',
    images: [
      { label: 'Siyah Dambıl Sırası & Loş Salon', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Demir Plakalar & Halter Barı', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kettlebell & Kauçuk Zemin', url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Boks Torbası & Bandajlar', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kondisyon İstasyonu & Metal Halatlar', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '✨ Hikayeli Joker (Nesneler & Kurumsal Siyah)',
    images: [
      { label: 'Deri Ajanda & Altın Uçlu Dolma Kalem', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Masada Ahşap Satranç Şahı', url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Mekanik Kol Saati & Dişliler', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Pirinç Antika Anahtar & Koyu Ahşap', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klasik Kahve Fincanı & Gözlük Detayı', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80' }
    ]
  }
];

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    isletme_adi: '',
    slug: '',
    google_review_link: '',
    whatsapp_telefon: '',
    konum: 'İstanbul, Türkiye',
    yonetici_sifresi: '1234',
    instagram_kullanici: '',
    banner_url: SECTORS[0].images[0].url
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  const handleNameChange = (val) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData(prev => ({
      ...prev,
      isletme_adi: val,
      slug: editingId ? prev.slug : generatedSlug
    }));
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('isletmeler')
      .select('*')
      .order('id', { ascending: false });
    if (data) setBusinesses(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === MASTER_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setFormData({
      isletme_adi: b.isletme_adi || '',
      slug: b.slug || '',
      google_review_link: b.google_review_link || '',
      whatsapp_telefon: b.whatsapp_telefon || '',
      konum: b.konum || '',
      yonetici_sifresi: b.yonetici_sifresi || '1234',
      instagram_kullanici: b.instagram_kullanici || '',
      banner_url: b.banner_url || SECTORS[0].images[0].url
    });
    setCreatedResult(null);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCreatedResult(null);

    if (editingId) {
      const { data, error } = await supabase
        .from('isletmeler')
        .update(formData)
        .eq('id', editingId)
        .select()
        .single();

      setSubmitting(false);

      if (error) {
        alert('Güncelleme hatası: ' + error.message);
      } else {
        alert(`"${data.isletme_adi}" başarıyla güncellendi!`);
        setEditingId(null);
        setFormData(initialFormState);
        fetchBusinesses();
      }
    } else {
      const { data, error } = await supabase
        .from('isletmeler')
        .insert([formData])
        .select()
        .single();

      setSubmitting(false);

      if (error) {
        alert('Oluşturma hatası: ' + error.message);
      } else {
        setCreatedResult(data);
        setFormData(initialFormState);
        fetchBusinesses();
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" işletmesini ve tüm verilerini silmek istediğinize emin misiniz?`)) return;
    await supabase.from('isletmeler').delete().eq('id', id);
    if (editingId === id) handleCancelEdit();
    fetchBusinesses();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Super Admin</h1>
          <p className="text-xs text-neutral-400 mt-1 mb-6">NFC İşletme & Kart Fabrikası</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Ana şifreyi girin"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-center tracking-widest text-lg outline-none transition"
            />
            {pinError && <p className="text-xs text-red-400 font-medium">Hatalı ana şifre.</p>}
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Üst Başlık */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Süper Yönetici Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">İşletme Fabrikası</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Hızlı NFC işletmesi oluşturma, görsel seçimi ve tam düzenleme</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-neutral-500 hover:text-neutral-300 px-3 py-2 border border-neutral-800 rounded-xl transition"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Başarıyla Oluşturulan İşletme Kartı */}
        {createdResult && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5" />
              <span>Tebrikler! "{createdResult.isletme_adi}" Başarıyla Oluşturuldu!</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    NFC Karta Yazılacak URL
                  </span>
                  <button
                    onClick={() => copyToClipboard(`${currentDomain}/${createdResult.slug}`, 'nfc-created')}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-lg flex items-center gap-1 text-neutral-200"
                  >
                    {copiedId === 'nfc-created' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'nfc-created' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <p className="text-xs text-amber-400 font-mono break-all">{currentDomain}/{createdResult.slug}</p>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    İşletme Sahibi Paneli
                  </span>
                  <button
                    onClick={() => copyToClipboard(`Panel: ${currentDomain}/${createdResult.slug}/panel\nŞifre: ${createdResult.yonetici_sifresi}`, 'panel-created')}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-lg flex items-center gap-1 text-neutral-200"
                  >
                    {copiedId === 'panel-created' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'panel-created' ? 'Kopyalandı' : 'Bilgileri Kopyala'}</span>
                  </button>
                </div>
                <p className="text-xs text-blue-400 font-mono break-all">{currentDomain}/{createdResult.slug}/panel</p>
                <p className="text-[11px] text-neutral-400 mt-1">Giriş Şifresi: <span className="text-white font-bold">{createdResult.yonetici_sifresi}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* İŞLETME EKLEME & DÜZENLEME FORMU */}
        <div className={`bg-neutral-900/50 border rounded-3xl p-6 sm:p-8 shadow-xl transition-all ${
          editingId ? 'border-amber-400 shadow-amber-400/5' : 'border-neutral-800'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {editingId ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
              <span>{editingId ? 'İşletme Bilgilerini Düzenle' : 'Yeni İşletme Kaydı'}</span>
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Düzenlemeyi İptal Et</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">İşletme Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Paşa Döner & Cafe"
                  value={formData.isletme_adi}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Link Uzantısı (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="pasa-doner"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-400 transition"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">URL: {currentDomain}/{formData.slug || 'ornek'}</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Google Harita / Yorum Linki *</label>
                <input
                  type="url"
                  required
                  placeholder="https://g.page/r/.../review veya Google Yorum linki"
                  value={formData.google_review_link}
                  onChange={(e) => setFormData({ ...formData, google_review_link: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">WhatsApp Telefonu (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="0532xxxxxxx"
                  value={formData.whatsapp_telefon}
                  onChange={(e) => setFormData({ ...formData, whatsapp_telefon: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Dükkan Sahibi Panel Şifresi</label>
                <input
                  type="text"
                  value={formData.yonetici_sifresi}
                  onChange={(e) => setFormData({ ...formData, yonetici_sifresi: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Konum / Şehir</label>
                <input
                  type="text"
                  placeholder="Kadıköy, İstanbul"
                  value={formData.konum}
                  onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Instagram Kullanıcı Adı (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="pasadoner (başında @ olmadan)"
                  value={formData.instagram_kullanici}
                  onChange={(e) => setFormData({ ...formData, instagram_kullanici: e.target.value.replace('@', '') })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* ZENGİNLEŞTİRİLMİŞ GÖRSEL KATALOĞU (JOKER EN SONDA) */}
            <div className="border-t border-neutral-800 pt-6">
              <label className="block text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Kapak Görseli Kataloğu (18 Sektör & Nesneli Joker)</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-normal">Fotoğrafa tıklayarak anında seçebilirsiniz</span>
              </label>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {SECTORS.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
                    <span className="text-xs font-bold text-neutral-300 mb-2 block">{sec.category}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {sec.images.map((img, iIdx) => {
                        const isSelected = formData.banner_url === img.url;
                        return (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() => setFormData({ ...formData, banner_url: img.url })}
                            className={`relative group rounded-xl overflow-hidden border text-left transition h-24 flex flex-col justify-end p-2 ${
                              isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-neutral-800 hover:border-neutral-600'
                            }`}
                          >
                            <img 
                              src={img.url} 
                              alt={img.label} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="text-[9px] text-white font-medium truncate">{img.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Özel Manuel URL */}
              <div className="mt-3">
                <input
                  type="url"
                  placeholder="Veya özel bir görsel linki yapıştırın..."
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-400 transition font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg ${
                editingId 
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/10' 
                  : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/10'
              }`}
            >
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{submitting ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Kaydet & Güncelle' : 'İşletmeyi Kaydet ve NFC Linki Üret'}</span>
            </button>
          </form>
        </div>

        {/* KAYITLI İŞLETMELER LİSTESİ */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neutral-400" />
                <span>Kayıtlı İşletmeler ({businesses.length})</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Düzenlemek için işletme kartına tıklayabilirsiniz</p>
            </div>
            <button
              onClick={fetchBusinesses}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 transition"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {businesses.map((b) => (
              <div 
                key={b.id} 
                className={`bg-neutral-950 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  editingId === b.id ? 'border-amber-400 bg-neutral-900/80' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div 
                  onClick={() => handleStartEdit(b)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <img 
                    src={b.banner_url || SECTORS[0].images[0].url} 
                    alt={b.isletme_adi} 
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{b.isletme_adi}</span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-normal">Düzenle</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 font-mono">
                      <span>/{b.slug}</span>
                      <span>•</span>
                      <span>PIN: <span className="text-amber-400 font-semibold">{b.yonetici_sifresi || '1234'}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(`${currentDomain}/${b.slug}`, `nfc-${b.id}`)}
                    className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 text-neutral-300 transition"
                  >
                    {copiedId === `nfc-${b.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copiedId === `nfc-${b.id}` ? 'Kopyalandı' : 'NFC Linki'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(`${currentDomain}/${b.slug}/panel`, `panel-${b.id}`)}
                    className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 text-neutral-300 transition"
                  >
                    {copiedId === `panel-${b.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{copiedId === `panel-${b.id}` ? 'Kopyalandı' : 'Panel'}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(b)}
                    className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white transition"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400" />
                  </button>

                  <a
                    href={`/${b.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition"
                    title="Sayfayı Gör"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(b.id, b.isletme_adi)}
                    className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-red-400 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}