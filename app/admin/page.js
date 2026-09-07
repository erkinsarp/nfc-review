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
      { label: 'Kuaför Aynaları & Işıklar', url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Usta Makas & Tarak Tutuşu', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Geleneksel Ustura Çeliği', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kırmızı Berber Direk Lambası', url: 'https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Tıraş Tezgahı', url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klasik Berber Sandalye Sırası', url: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💇‍♀️ Kadın Kuaförü & Saç Tasarım',
    images: [
      { label: 'Saç Yıkama Koltukları', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kuaför Aynası & Ampuller', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Profesyonel Fön & Fırça', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Salon & Kozmetik', url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Saç Boyası & Karıştırma Kabı', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Döner Kuaför Sandalyesi', url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gelin Saçı & Aksesuar Masası', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kuaför Ürün Rafı & Şampuanlar', url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıcak Maşa & Düzleştirici', url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Salon Resepsiyonu', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '☕ Kafe, Kahve & Tatlı',
    images: [
      { label: 'Espresso Bar & Loş Ambiyans', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşapta Latte Art', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kahve Çekirdeği & Kavurma', url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Bakır Cezve & Türk Kahvesi', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Vitrinde Çikolatalı Pasta', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Barista Portafiltre Kahve Akışı', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taze Çıtır Kruvasan Masası', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Mermerde Buzlu Filtre Kahve', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Retro Kahve Değirmeni & Kaşık', url: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıklı Kafe Masaları', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🥩 Restoran, Ocakbaşı & Steak',
    images: [
      { label: 'Lüks Masa & Kadehler', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Izgara & Alev Şovu', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Şık Servis & Koyu Tabak', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Közde Kebap Şişleri', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Döküm Tavada Mühürlü Antrikot', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Şef Mutfak Tezgâhı & Hazırlık', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taş Fırında Pişen Lahmacun', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Ambiyansta Restoran Salonu', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mangal Kömürü & Izgara Dumanı', url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Özel Meze Tabakları Dizilimi', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🌯 Dönerci & Fast Food',
    images: [
      { label: 'Ateşte Dönen Et Döner', url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Döner Kesim Tezgâhı & Bıçak', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıcak Dürüm Servisi', url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Izgara Burger & Çıtır Patates', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Fırından Çıkan Pide & Lavaş', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tavuk Döner Şişi & Alev', url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tombik Ekmek Döner Hazırlığı', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Soslu Dürüm Kesim Tahtası', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Izgara Köfte & Biber Tabağı', url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Fast Food Sipariş Tezgâhı', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🍋 Çiğköfteci & Mezeci',
    images: [
      { label: 'Taze Sıkım Çiğköfte & Marul', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Soslu Çiğköfte Dürüm Kesimi', url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tepside Yoğurma & İsot Dokusu', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sulu Limon Dilimleri & Nar Ekşisi', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taze Kıvırcık Marul & Yeşillik', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lavaş Üzerinde Hazırlık Tezgâhı', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kırmızı Acı Pul Biber & Baharatlar', url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dükkan Meze & Turşu Tezgâhı', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Soğuk Şalgam Kadehi & Koyu Zemin', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Çıtır Lavaş Dürüm Sunumu', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🛒 Bakkal, Market & Şarküteri',
    images: [
      { label: 'Ahşap Kasalarda Taze Meyve', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Geleneksel Şarküteri Peynirleri', url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıkta Market Rafları', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Taş Fırın Ekmeği Sepeti', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Zeytin & Doğal Gurme Kavanozlar', url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Market Kasası & Barkod Alanı', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Baharat & Bakliyat Çuvalları', url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dükkan Önü Taze Sebze Tezgâhı', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Geleneksel Mahalle Bakkal Vitrini', url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Cam Kavanozlarda Şekerleme', url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🍾 Tekel Bayi & Meşrubat',
    images: [
      { label: 'Işıklı Koyu Şişe Rafları', url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Ahşap Şarap Mahzeni Rafları', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Buz Kovasında Meşrubatlar', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Neon Aydınlatmalı Bar Vitrini', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kadeh & Amber İçecek Detayı', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Cam Dolapta Soğuk İçecek Sırası', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Zemin Üzerinde Premium Şişe', url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gece Tekel Aydınlatmalı Tabela', url: 'https://images.unsplash.com/photo-1508253730651-e5ace80a7025?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlıkta Mantar Tıpalı Şişeler', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dükkan Tezgâhı & Fıstık/Meze', url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🎮 İnternet Cafe & E-Spor',
    images: [
      { label: 'RGB Işıklı Mekanik Klavye', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kavisli Oyuncu Monitörü', url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Neon Kulaklık & Gamepad', url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıralı Gaming Kasaları & Fanlar', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Konsol Oyun Kolu & Koyu Fon', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş E-Spor Arena Salonu', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80' },
      { label: 'RGB Oyuncu Faresi & Pad', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Oyuncu Koltukları Sırası', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=80' },
      { label: 'VR Sanal Gerçeklik Gözlüğü', url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlıkta Aydınlatmalı Anakart', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '📱 Elektronikçi, Telefon & Tamir',
    images: [
      { label: 'Büyüteç & Anakart Lehim Tamiri', url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Tornavidalar & Telefon İçi', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıkta Devre Kartı & Çipler', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Telefon Ekran Değişim Masası', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dijital Multimetre & Problar', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıralı Telefon Kılıfları Vitrini', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mikroskop Altında Mikroçip', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Açık Laptop Tamir Tezgâhı', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıcak Hava Havya İstasyonu', url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Elektronik Mağazası Girişi', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🏠 Emlak Ofisi & Gayrimenkul',
    images: [
      { label: 'Mimari Maket & Çizim Masası', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Daire Sözleşmesi & Kalem', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Pirinç Ev Anahtarı & Koyu Ahşap', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gece Işıklarında Rezidans', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Koltuklu Emlak Toplantı Odası', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Villa Havuz & Dış Cephe', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Emlak Ofisi Karşılama Masası', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gökdelen Camından Şehir Manzarası', url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Minimalist Lüks Salon İç Mekan', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Altın Detaylı Daire Kapı Kolu', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '📊 Muhasebe & Mali Müşavirlik',
    images: [
      { label: 'Hesap Makinesi & Dolma Kalem', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Finansal Grafik & Ajanda', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Masa Lambası & Resmi Evrak', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mühür, Kaşe & İmzalı Sözleşme', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klasik Hukuk & Mevzuat Kitaplığı', url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Masa Sümeni & Evrak Dosyaları', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Vergi Dosyaları Arşiv Rafları', url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dizüstü Bilgisayarda Bilanço Analizi', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Gözlük & Resmi Rapor Tabloları', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kurumsal Ofis Giriş Bankosu', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🚗 Oto Yıkama & Detailing',
    images: [
      { label: 'Petek LED & Siyah Araba', url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Seramik Kaplama & Kar Köpüğü', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Parlak Siyah Jant Temizliği', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Polisaj & Pasta Cila Parlatması', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Basınçlı Yıkama Tabancası', url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Koltuk & Detaylı İç Temizlik', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Garajda Parlayan Boya', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mikrofiber Bezle Kurulama', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Detailing Stüdyo Işık Hattı', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Far Yenileme & Parlatma', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🔧 Oto Tamir, Lastik & Sanayi',
    images: [
      { label: 'Lifte Alınmış Araç Altı Bakımı', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Somun Anahtarları & Takım Panosu', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Hava Tabancasıyla Lastik Sökümü', url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Motor Bloğu & Yağ Değişimi', url: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Fren Balatası & Disk Değişimi', url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Amortisör & Alt Takım Onarımı', url: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Bilgisayarlı Araç Arıza Tespiti', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Akü Ölçümü & Elektrik Tesisatı', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sıralı Sıfır Lastik Rafları', url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sanayi Dükkanı Önü & Takımlar', url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💅 Güzellik Merkezi, Tırnak & Spa',
    images: [
      { label: 'Mum Işığı & Doğal Taş Spa', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Estetik & Manikür Masası', url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Cilt Bakım Serumu & Damlalık', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Renkli Oje Şişeleri & UV Cihazı', url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Aromaterapi Masaj Yağı & Havlular', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lazer Epilasyon & Cilt Cihazı', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80' },
      { label: 'İpek Kirpik & Kaş Tasarım Masası', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Pedikür & Ayak Bakım Havuzu', url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Masaj Yatağı Odası', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klinik Resepsiyon & Parfüm Standı', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🎨 Dövme (Tattoo) & Sanat',
    images: [
      { label: 'Dövme Makinesi & Odak Işığı', url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Dövme Masası & Şişeler', url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Siyah Mürekkep & İğne Uçları', url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Özel Çizim Eskizleri & Eldiven', url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Deri Koltuk & Sanatçı Lambası', url: 'https://images.unsplash.com/photo-1590246814883-578358eb09ee?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Piercing Aletleri & Titanyum Takılar', url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kırmızı Işıklı Retro Dövme Stüdyosu', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mürekkep Boya Kapakları Dizilimi', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Dövme Sanatçısı Çalışma Tezgâhı', url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Sanat Galerisi Duvarı', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🦷 Diş Kliniği & Sağlık',
    images: [
      { label: 'Modern Diş Ünitesi & Monitör', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Steril Çelik Alet Tepsisi', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Minimalist Sağlık Odası', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Hekim Tepe Odak Lambası', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Panoramik Çene Röntgeni', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Diş Beyazlatma Cihazı & Işık', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Porselen Diş Modeli & Laboratuvar', url: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Klinik Karşılama Bankosu', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Sterilizasyon Otoklav Cihazı', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Şık Bekleme Salonu Koltukları', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💪 Spor Salonu, Fitness & Gym',
    images: [
      { label: 'Siyah Dambıl Sırası & Loş Salon', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Demir Plakalar & Halter Barı', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Döküm Kettlebell & Kauçuk Zemin', url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Boks Torbası & Deri Eldivenler', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kondisyon İstasyonu & Makaralar', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koşu Bandı Sırası & Şehir Işıkları', url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Crossfit Halatları & Ağırlık Sehpası', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Salonda Barfiks Demiri', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Pilates Reformer Aletleri', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Protein Bar & Karşılama Bankosu', url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '✨ Premium Joker (Dükkan Cepheleri & Şık Mekanlar)',
    images: [
      { label: 'Gece Işıklı Lüks Butik Cephesi', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Mermer Resepsiyon Bankosu', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Loş Işıklı Şık Cadde Mağazası', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Cam & Çelik İşletme Girişi', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Pirinç Altın Tabela Işıklandırması', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Akşam Işıklarında Şehir Çarşısı', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Siyah Metal Vitrin & Spot Işıklar', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Neon Tabela & Gece İşletme Vitrini', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşap Karşılama Masası', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Bekleme Salonu & Koltuklar', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80' }
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

            {/* ZENGİNLEŞTİRİLMİŞ 10'ARLI GÖRSEL KATALOĞU (JOKER EN SONDA) */}
            <div className="border-t border-neutral-800 pt-6">
              <label className="block text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Kapak Görseli Kataloğu (Her Sektör İçin 10 Seçenek)</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-normal">Fotoğrafa tıklayarak anında seçebilirsiniz</span>
              </label>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
                            className={`relative group rounded-xl overflow-hidden border text-left transition h-20 flex flex-col justify-end p-1.5 ${
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
                              {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
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