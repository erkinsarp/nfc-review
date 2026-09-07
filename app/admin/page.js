'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Plus, Copy, Check, ExternalLink, Trash2, Edit3, X,
  Lock, KeyRound, Image as ImageIcon, Sparkles, RefreshCw, Smartphone, Wand2, ArrowRight
} from 'lucide-react';

const MASTER_PIN = 'admin2026';

// Karanlık Mod (Dark Theme) Uyumlu 3'erli Sektör Fotoğrafları
const SECTORS = [
  {
    category: '💈 Erkek Berber & Kuaför',
    images: [
      { label: 'Loş Işık & Deri Koltuk', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Makas & Tezgah Detayı', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Vintage Berber Dükkanı', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '☕ Kafe & Kahveci',
    images: [
      { label: 'Espresso Bar & Loş Ambiyans', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Koyu Ahşapta Latte Art', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kavurma & Sıcak Işıklar', url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🥩 Restoran, Ocakbaşı & Steak',
    images: [
      { label: 'Lüks Masa & Kadehler', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Izgara & Alev Şovu', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Şık Servis & Koyu Arka Plan', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '💅 Güzellik, Tırnak & Spa',
    images: [
      { label: 'Mum Işığı & Doğal Taş Spa', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Modern Estetik Stüdyo', url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Kozmetik & Masaj Odası', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🚗 Oto Yıkama & Detailing',
    images: [
      { label: 'Petek LED & Siyah Araba', url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Seramik Kaplama & Köpük', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Garaj & Parlak Yansıma', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🎨 Dövme (Tattoo) & Sanat',
    images: [
      { label: 'Dövme Makinesi & Işık', url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Karanlık Dövme Stüdyosu', url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Mürekkep & Detay Çekim', url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '🦷 Diş Kliniği & Sağlık',
    images: [
      { label: 'Ultra Modern Klinik', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Lüks Muayene Odası', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Minimalist Sağlık Odası', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80' }
    ]
  },
  {
    category: '✨ Lüks Gold & Siyah (Joker)',
    images: [
      { label: 'Gold Işık Dalgaları', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Siyah Geometrik Doku', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80' },
      { label: 'Soyut Altın Parıltı', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80' }
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

  // Düzenleme durumu
  const [editingId, setEditingId] = useState(null);

  // Link Dönüştürücü (Yöntem A) State
  const [rawLinkInput, setRawLinkInput] = useState('');

  // Form State
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

  // Yöntem A: Google Maps Link Dönüştürücü
  const handleConvertGoogleLink = () => {
    if (!rawLinkInput.trim()) return;
    const input = rawLinkInput.trim();

    // 1. Zaten direkt review linki ise
    if (input.includes('local/writereview') || input.includes('/review')) {
      setFormData(prev => ({ ...prev, google_review_link: input }));
      setRawLinkInput('');
      return;
    }

    // 2. Place ID içeriyorsa
    const placeIdMatch = input.match(/place_id:([a-zA-Z0-9_-]+)/) || input.match(/placeid=([a-zA-Z0-9_-]+)/);
    if (placeIdMatch && placeIdMatch[1]) {
      const converted = `https://search.google.com/local/writereview?placeid=${placeIdMatch[1]}`;
      setFormData(prev => ({ ...prev, google_review_link: converted }));
      setRawLinkInput('');
      return;
    }

    // 3. maps.app.goo.gl veya maps.google.com linkiyse ya da salt isimse
    // Google Haritalar arama tabanlı doğrudan yorum popup tetikleyicisi
    let cleanQuery = input;
    if (input.includes('maps.google') || input.includes('goo.gl')) {
      // URL'deki işletme adını çekmeye çalış
      const queryMatch = input.match(/place\/([^/@?]+)/);
      if (queryMatch && queryMatch[1]) {
        cleanQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, ' '));
      }
    }
    
    // Güvenli doğrudan arama yorum popup bağlantısı
    const autoLink = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery + ' yorumlar')}&ludocid=search`;
    setFormData(prev => ({ ...prev, google_review_link: input.startsWith('http') ? input : autoLink }));
    setRawLinkInput('');
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
    window.scrollTo({ top: 300, behavior: 'smooth' });
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
      // Güncelleme İşlemi
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
      // Yeni Ekleme İşlemi
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
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 text-white space-y-4 animate-in fade-in">
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

        {/* HIZLI GOOGLE LINK DÖNÜŞTÜRÜCÜ (YÖNTEM A) */}
        <div className="bg-neutral-900/60 border border-amber-400/20 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
            <Wand2 className="w-4 h-4" />
            <span>Hızlı Google Yorum Linki Dönüştürücü (Yöntem A)</span>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Google Haritalar'dan aldığın herhangi bir paylaşım linkini (`maps.app.goo.gl` vb.) buraya yapıştırıp dönüştür; otomatik olarak formdaki alana aktarılır.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Örn: https://maps.app.goo.gl/... veya Google Maps URL'si yapıştırın"
              value={rawLinkInput}
              onChange={(e) => setRawLinkInput(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
            />
            <button
              type="button"
              onClick={handleConvertGoogleLink}
              className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Dönüştür & Forma Aktar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

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
                  placeholder="https://g.page/r/.../review veya writereview linki"
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
                  placeholder="pasadoner"
                  value={formData.instagram_kullanici}
                  onChange={(e) => setFormData({ ...formData, instagram_kullanici: e.target.value.replace('@', '') })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* SEKTÖRLERE ÖZEL 3'ERLİ GÖRSEL SEÇİM KATALOĞU */}
            <div className="border-t border-neutral-800 pt-6">
              <label className="block text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Kapak Görseli Kataloğu (Karanlık Mod & Lüks Tonlar)</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-normal">Fotoğrafa tıklayarak anında seçebilirsiniz</span>
              </label>

              {/* Sektör Grupları */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {SECTORS.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
                    <span className="text-xs font-bold text-neutral-300 mb-2 block">{sec.category}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {sec.images.map((img, iIdx) => {
                        const isSelected = formData.banner_url === img.url;
                        return (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() => setFormData({ ...formData, banner_url: img.url })}
                            className={`relative group rounded-xl overflow-hidden border text-left transition h-20 flex flex-col justify-end p-2 ${
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
                              <span className="text-[10px] text-white font-medium truncate">{img.label}</span>
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
                  placeholder="Veya Google Haritalar'dan aldığınız özel görsel URL'sini yapıştırın..."
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
                {/* Tıklayınca Forma Yükler */}
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