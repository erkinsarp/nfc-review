'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Eye, ThumbsUp, MessageSquareWarning, TrendingUp, Calendar, RefreshCw, 
  Lock, KeyRound, Star, CheckCheck, Clock 
} from 'lucide-react';

export default function BusinessDashboard() {
  const params = useParams();
  const slug = params?.slug;

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');

  const [stats, setStats] = useState({
    todayViews: 0,
    todayPositive: 0,
    todayNegativeMessages: 0,
    totalViews: 0,
    totalPositive: 0,
    totalNegativeMessages: 0,
  });

  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);

    const { data: bData, error: bError } = await supabase
      .from('isletmeler')
      .select('*')
      .eq('slug', decodeURIComponent(slug))
      .maybeSingle();

    if (bError || !bData) {
      setLoading(false);
      return;
    }
    setBusiness(bData);

    // 1. Analitik verileri
    const { data: analytics } = await supabase
      .from('business_analytics')
      .select('*')
      .eq('business_id', bData.id);

    // 2. Müşteri mesajları
    const { data: mData } = await supabase
      .from('musteri_mesajlari')
      .select('*')
      .eq('business_id', bData.id)
      .order('created_at', { ascending: false });

    const messageList = mData || [];
    setMessages(messageList);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let tViews = 0, tPos = 0;
    let allViews = 0, allPos = 0;

    if (analytics) {
      analytics.forEach((item) => {
        const itemDate = new Date(item.created_at);
        const isToday = itemDate >= today;

        if (item.event_type === 'page_view') {
          allViews++;
          if (isToday) tViews++;
        } else if (item.event_type === 'positive_review') {
          allPos++;
          if (isToday) tPos++;
        }
      });
    }

    // Gerçek mesaj sayıları üzerinden hesaplama (Sayı uyuşmazlığını çözer)
    const tNegMessages = messageList.filter(m => new Date(m.created_at) >= today).length;
    const allNegMessages = messageList.length;

    setStats({
      todayViews: tViews,
      todayPositive: tPos,
      todayNegativeMessages: tNegMessages,
      totalViews: allViews,
      totalPositive: allPos,
      totalNegativeMessages: allNegMessages,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = business?.yonetici_sifresi || '1234';

    if (pinInput.trim() === correctPassword) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const toggleMessageRead = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setMessages(messages.map(m => m.id === id ? { ...m, okundu: nextStatus } : m));

    await supabase
      .from('musteri_mesajlari')
      .update({ okundu: nextStatus })
      .eq('id', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 font-sans">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-sans">
        <p className="text-neutral-400">İşletme paneli bulunamadı.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold">{business.isletme_adi}</h1>
          <p className="text-xs text-neutral-400 mt-1 mb-6">Yönetici Paneli Girişi</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Şifreyi girin"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-center tracking-widest text-lg outline-none transition"
            />

            {pinError && (
              <p className="text-xs text-red-400 font-medium">Hatalı şifre, tekrar deneyin.</p>
            )}

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

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.okundu;
    if (filter === 'read') return m.okundu;
    return true;
  });

  const unreadCount = messages.filter(m => !m.okundu).length;
  const readCount = messages.filter(m => m.okundu).length;
  const totalFeedbackCount = stats.totalPositive + stats.totalNegativeMessages;
  const successRate = totalFeedbackCount > 0 
    ? Math.round((stats.totalPositive / totalFeedbackCount) * 100) 
    : 100;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Üst Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Yönetici Paneli</span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">{business.isletme_adi}</h1>
            <p className="text-xs text-neutral-400 mt-1">İstatistikler ve Müşteri Bildirimleri</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs px-4 py-2.5 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Yenile</span>
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="text-xs px-3 py-2.5 text-neutral-500 hover:text-neutral-300 transition"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Bugünün İstatistikleri */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-neutral-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Bugünün İstatistikleri</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Bugün Dokunma</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.todayViews}</p>
              <p className="text-[11px] text-neutral-500 mt-1">NFC kart temas sayısı</p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Google'a Giden</span>
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400">{stats.todayPositive}</p>
              <p className="text-[11px] text-neutral-500 mt-1">4 ve 5 yıldızlı yorumlar</p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Gelen Şikayet</span>
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-amber-400">{stats.todayNegativeMessages}</p>
              <p className="text-[11px] text-neutral-500 mt-1">Bugün yazılan mesaj sayısı</p>
            </div>
          </div>
        </div>

        {/* Gelen Şikayet ve Bildirimler Havuzu */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-amber-400" />
                <span>Gelen Özel Şikayet ve Bildirimler</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Google'a gitmeden doğrudan sisteme kaydedilen müşteri notları
              </p>
            </div>

            {/* Filtre Sekmeleri */}
            <div className="inline-flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tümü ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === 'unread' ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Okunmamış ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === 'read' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Okunmuş ({readCount})
              </button>
            </div>
          </div>

          {/* Mesaj Listesi */}
          {filteredMessages.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-neutral-800 rounded-2xl">
              <p className="text-sm text-neutral-500">Bu filtrede gösterilecek bildirim bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => {
                const dateFormatted = new Date(msg.created_at).toLocaleString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      msg.okundu
                        ? 'bg-neutral-950/40 border-neutral-900 opacity-65'
                        : 'bg-neutral-900/90 border-neutral-800 shadow-md'
                    }`}
                  >
                    {/* Üst Bilgi Satırı */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-neutral-800/50">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{msg.yildiz} Yıldız</span>
                        </div>

                        {!msg.okundu ? (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Yeni
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[10px]">Okundu</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{dateFormatted}</span>
                        </div>

                        <button
                          onClick={() => toggleMessageRead(msg.id, msg.okundu)}
                          className={`p-1.5 rounded-lg border transition ${
                            msg.okundu
                              ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                              : 'border-amber-400/50 text-amber-400 hover:bg-amber-400/10'
                          }`}
                          title={msg.okundu ? 'Okunmadı yap' : 'Okundu olarak işaretle'}
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mesaj İçeriği (Kelime kırılması ve taşma korumalı) */}
                    <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed break-words overflow-hidden">
                      {msg.mesaj}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Genel İstatistik Özeti */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-neutral-300">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Genel Toplam Performans</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Toplam Dokunma</span>
              <p className="text-xl font-bold mt-1">{stats.totalViews}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Toplam Olumlu Yorum</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{stats.totalPositive}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Toplam Şikayet Mesajı</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{stats.totalNegativeMessages}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4">
              <span className="text-xs text-neutral-500">Memnuniyet Oranı</span>
              <p className="text-xl font-bold text-blue-400 mt-1">%{successRate}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}