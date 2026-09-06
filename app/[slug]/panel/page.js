'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, ThumbsUp, MessageSquareWarning, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

export default function BusinessDashboard() {
  const params = useParams();
  const slug = params?.slug;

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayViews: 0,
    todayPositive: 0,
    todayNegative: 0,
    totalViews: 0,
    totalPositive: 0,
    totalNegative: 0,
  });

  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);

    // 1. İşletmeyi getir
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

    // 2. Analitik verilerini çek
    const { data: analytics, error: aError } = await supabase
      .from('business_analytics')
      .select('*')
      .eq('business_id', bData.id);

    if (aError || !analytics) {
      setLoading(false);
      return;
    }

    // Bugünün başlangıç zamanı (Gece 00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let tViews = 0;
    let tPos = 0;
    let tNeg = 0;
    let allViews = 0;
    let allPos = 0;
    let allNeg = 0;

    analytics.forEach((item) => {
      const itemDate = new Date(item.created_at);
      const isToday = itemDate >= today;

      if (item.event_type === 'page_view') {
        allViews++;
        if (isToday) tViews++;
      } else if (item.event_type === 'positive_review') {
        allPos++;
        if (isToday) tPos++;
      } else if (item.event_type === 'negative_review') {
        allNeg++;
        if (isToday) tNeg++;
      }
    });

    setStats({
      todayViews: tViews,
      todayPositive: tPos,
      todayNegative: tNeg,
      totalViews: allViews,
      totalPositive: allPos,
      totalNegative: allNeg,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

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

  const successRate = stats.totalViews > 0 
    ? Math.round(((stats.totalPositive) / (stats.totalPositive + stats.totalNegative || 1)) * 100) 
    : 100;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Üst Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Yönetici Paneli</span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">{business.isletme_adi}</h1>
            <p className="text-xs text-neutral-400 mt-1">NFC Kart & Değerlendirme İstatistikleri</p>
          </div>
          <button 
            onClick={fetchData}
            className="self-start sm:self-center flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs px-4 py-2.5 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Verileri Güncelle</span>
          </button>
        </div>

        {/* Bugünün Özeti */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-neutral-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Bugünün İstatistikleri</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Bugün Okutma</span>
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
              <p className="text-[11px] text-neutral-500 mt-1">4 ve 5 yıldız verenler</p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Özel Şikayet</span>
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-amber-400">{stats.todayNegative}</p>
              <p className="text-[11px] text-neutral-500 mt-1">WhatsApp'a yönlendirilenler</p>
            </div>
          </div>
        </div>

        {/* Tüm Zamanlar Özeti */}
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
              <span className="text-xs text-neutral-500">Engellenen Şikayet</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{stats.totalNegative}</p>
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