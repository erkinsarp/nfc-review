'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Plus, Copy, Check, ExternalLink, Trash2, 
  Lock, KeyRound, Image as ImageIcon, Sparkles, RefreshCw, Smartphone
} from 'lucide-react';

const MASTER_PIN = 'xswQG0fh'; // Giriş şifren

// Hızlı Kategori Görselleri (Yüksek kaliteli, telifsiz şık mekan fotoğrafları)
const CATEGORY_PRESETS = [
  { 
    name: 'Berber & Kuaför', 
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Kafe & Kahveci', 
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Restoran & Yemek', 
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Oto Yıkama & Detailing', 
    url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Güzellik & Spa', 
    url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Sade Gold / Lüks Minimal', 
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' 
  }
];

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    isletme_adi: '',
    slug: '',
    google_review_link: '',
    whatsapp_telefon: '',
    konum: 'İstanbul, Türkiye',
    yonetici_sifresi: '1234',
    instagram_kullanici: '',
    banner_url: CATEGORY_PRESETS[0].url
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  // Otomatik Slug (isletme_adi yazıldıkça slug üretir)
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
      slug: generatedSlug
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCreatedResult(null);

    const { data, error } = await supabase
      .from('isletmeler')
      .insert([formData])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      alert('Hata oluştu: ' + error.message);
    } else {
      setCreatedResult(data);
      fetchBusinesses();
      // Formu sıfırla
      setFormData({
        isletme_adi: '',
        slug: '',
        google_review_link: '',
        whatsapp_telefon: '',
        konum: 'İstanbul, Türkiye',
        yonetici_sifresi: '1234',
        instagram_kullanici: '',
        banner_url: CATEGORY_PRESETS[0].url
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" işletmesini silmek istediğinize emin misiniz?`)) return;
    await supabase.from('isletmeler').delete().eq('id', id);
    fetchBusinesses();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. PIN Giriş Ekranı
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Super Admin</h1>
          <p className="text-xs text-neutral-400 mt-1 mb-6">NFC İşletme Yönetim Merkezi</p>

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
            <h1 className="text-2xl sm:text-3xl font-bold">İşletme & Kart Fabrikası</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Saniyeler içinde yeni NFC işletmesi oluşturun ve linkleri teslim edin</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-neutral-500 hover:text-neutral-300 px-3 py-2 border border-neutral-800 rounded-xl"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Başarıyla Oluşturulan İşletme Kartı (Varsa) */}
        {createdResult && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5" />
              <span>Tebrikler! "{createdResult.isletme_adi}" Başarıyla Oluşturuldu!</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NFC Karta Yazılacak Link */}
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

              {/* Dükkan Sahibine Verilecek Panel Linki */}
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

        {/* Yeni İşletme Ekleme Formu */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-amber-400" />
            <span>Yeni İşletme Kaydı</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* İşletme Adı */}
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

              {/* Slug */}
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
                <span className="text-[10px] text-neutral-500 mt-1 block">Kart adresi: {currentDomain}/{formData.slug || 'ornek'}</span>
              </div>

              {/* Google Review Linki */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Google Harita / Yorum Linki *</label>
                <input
                  type="url"
                  required
                  placeholder="https://g.page/r/.../review veya Google Maps linki"
                  value={formData.google_review_link}
                  onChange={(e) => setFormData({ ...formData, google_review_link: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* WhatsApp Telefonu */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">WhatsApp Numarası (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="0532xxxxxxx"
                  value={formData.whatsapp_telefon}
                  onChange={(e) => setFormData({ ...formData, whatsapp_telefon: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Panel Şifresi */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Dükkan Sahibi Panel Şifresi</label>
                <input
                  type="text"
                  value={formData.yonetici_sifresi}
                  onChange={(e) => setFormData({ ...formData, yonetici_sifresi: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Konum */}
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

              {/* Instagram */}
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

            {/* Görsel & Kategori Seçimi */}
            <div className="border-t border-neutral-800 pt-6">
              <label className="block text-xs font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Kapak Görseli (Hızlı Kategori Seç veya Özel URL Yapıştır)</span>
              </label>

              {/* Kategori Butonları */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {CATEGORY_PRESETS.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, banner_url: cat.url })}
                    className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center gap-2 ${
                      formData.banner_url === cat.url
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <img src={cat.url} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Manuel Özel Görsel URL */}
              <input
                type="url"
                placeholder="Veya dükkanın kendi Google Haritalar görsel linkini yapıştırın..."
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-400 transition font-mono"
              />
            </div>

            {/* Kaydet Butonu */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-400/10"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'İşletme Oluşturuluyor...' : 'İşletmeyi Kaydet ve NFC Linki Üret'}</span>
            </button>
          </form>
        </div>

        {/* Kayıtlı Tüm İşletmeler Listesi */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neutral-400" />
                <span>Kayıtlı İşletmeler ({businesses.length})</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Sistemdeki tüm aktif dükkanlar ve panelleri</p>
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
                className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={b.banner_url || CATEGORY_PRESETS[0].url} 
                    alt={b.isletme_adi} 
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{b.isletme_adi}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 font-mono">
                      <span>/{b.slug}</span>
                      <span>•</span>
                      <span>PIN: <span className="text-amber-400 font-semibold">{b.yonetici_sifresi || '1234'}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* NFC Linkini Kopyala */}
                  <button
                    onClick={() => copyToClipboard(`${currentDomain}/${b.slug}`, `nfc-${b.id}`)}
                    className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 text-neutral-300 transition"
                  >
                    {copiedId === `nfc-${b.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copiedId === `nfc-${b.id}` ? 'Kopyalandı' : 'NFC Linki'}</span>
                  </button>

                  {/* Panel Linkini Kopyala */}
                  <button
                    onClick={() => copyToClipboard(`${currentDomain}/${b.slug}/panel`, `panel-${b.id}`)}
                    className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-1.5 text-neutral-300 transition"
                  >
                    {copiedId === `panel-${b.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{copiedId === `panel-${b.id}` ? 'Kopyalandı' : 'Panel Linki'}</span>
                  </button>

                  {/* Sayfayı Aç */}
                  <a
                    href={`/${b.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition"
                    title="Müşteri Sayfasına Git"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Sil */}
                  <button
                    onClick={() => handleDelete(b.id, b.isletme_adi)}
                    className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-red-400 transition"
                    title="İşletmeyi Sil"
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