'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Star, MapPin, MessageCircle, ExternalLink, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReviewGatingPage() {
  const params = useParams();
  const slug = params?.slug;

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Geri bildirim formu state'leri
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchBusiness() {
      setLoading(true);
      const { data, error } = await supabase
        .from('isletmeler')
        .select('*')
        .eq('slug', decodeURIComponent(slug))
        .maybeSingle();

      if (error) {
        console.error('Supabase Hatası:', error);
        setErrorMessage(error.message);
      } else if (!data) {
        setErrorMessage(`"${slug}" adına ait işletme bulunamadı.`);
      } else {
        setBusiness(data);

        // Toplam tıklamayı artır
        await supabase
          .from('isletmeler')
          .update({ toplam_tiklama: (data.toplam_tiklama || 0) + 1 })
          .eq('id', data.id);

        // Analitik logu
        await supabase
          .from('business_analytics')
          .insert([{ business_id: data.id, event_type: 'page_view' }]);
      }
      setLoading(false);
    }

    fetchBusiness();
  }, [slug]);

  const handleRating = async (rating) => {
    setSelectedStar(rating);

    // Analitik tablosuna log düş
    if (business?.id) {
      await supabase
        .from('business_analytics')
        .insert([
          {
            business_id: business.id,
            event_type: rating >= 4 ? 'positive_review' : 'negative_review',
            rating: rating
          }
        ]);
    }

    if (rating >= 4) {
      setIsRedirecting(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setTimeout(() => {
        if (business?.google_review_link) {
          window.location.href = business.google_review_link;
        }
      }, 1200);
    } else {
      // 1-3 yıldızda WhatsApp yerine dahili form açılır
      setShowFeedbackForm(true);
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !business?.id) return;

    setSubmittingFeedback(true);

    const { error } = await supabase.from('musteri_mesajlari').insert([
      {
        business_id: business.id,
        yildiz: selectedStar,
        mesaj: feedbackText.trim()
      }
    ]);

    setSubmittingFeedback(false);

    if (!error) {
      setFeedbackSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 font-sans">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm tracking-wider">İşletme yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white px-4 font-sans text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">İşletme Bulunamadı</h2>
        <p className="text-neutral-400 text-sm max-w-xs mb-2">
          {errorMessage || 'Bu adrese atanmış bir işletme kaydı bulunamadı.'}
        </p>
        <span className="text-xs text-neutral-600 bg-neutral-900 px-3 py-1 rounded">
          Aranan Slug: {slug || 'belirtilmedi'}
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start p-4 font-sans selection:bg-amber-400 selection:text-black">
      <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm mt-4">
        
        <div className="relative h-44 w-full overflow-hidden bg-neutral-800">
          <img
            src={business.banner_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'}
            alt={business.isletme_adi}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
        </div>

        <div className="px-6 pb-6 pt-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs font-medium text-neutral-300 mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{business.konum || 'TÜRKİYE'}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            {business.isletme_adi}
          </h1>

          <p className="text-neutral-400 text-xs leading-relaxed max-w-xs mx-auto mb-6">
            Hizmet kalitemizi artırmamız için deneyiminizi puanlayın. Görüşleriniz bizim için çok değerli!
          </p>

          {/* Yıldız Değerlendirme Bölümü */}
          {!showFeedbackForm && (
            <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-5 mb-5 shadow-inner">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                Deneyiminizi Puanlayın
              </p>

              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoveredStar || selectedStar) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={isRedirecting}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleRating(star)}
                      className="p-1 transition-transform transform active:scale-90 hover:scale-110 focus:outline-none"
                      aria-label={`${star} Yıldız`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${
                          isActive
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-neutral-600 fill-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {isRedirecting && (
                <p className="mt-3 text-xs font-medium text-amber-400 animate-pulse">
                  Harika! Google Yorumlara aktarılıyorsunuz...
                </p>
              )}
            </div>
          )}

          {/* 1-3 Yıldız Seçildiğinde Açılan Dahili Geri Bildirim Formu */}
          {showFeedbackForm && (
            <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-5 mb-5 text-left transition-all">
              {feedbackSubmitted ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">Geri bildiriminiz iletildi!</p>
                  <p className="text-xs text-neutral-400">
                    Görüşlerinizi doğrudan işletme yönetimine aktardık. Deneyiminizi telafi etmek için çalışacağız.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400">
                      Verilen Puan: {selectedStar} / 5 Yıldız
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-300"
                    >
                      Değiştir
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400">
                    Sizi memnun edemediğimiz için üzgünüz. Yaşadığınız sorunu veya önerinizi doğrudan yöneticiye iletin:
                  </p>

                  <textarea
                    required
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Deneyiminizi buraya yazın..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none transition"
                  />

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingFeedback ? 'Gönderiliyor...' : 'Yönetime İlet'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Sosyal Medya & İletişim Butonları */}
          <div className="flex flex-col gap-2.5">
            {business.instagram_kullanici && (
              <a
                href={`https://instagram.com/${business.instagram_kullanici}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-xs font-medium text-neutral-200 transition-colors"
              >
                <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Bizi Instagram'da Takip Edin</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 ml-auto" />
              </a>
            )}

            {business.whatsapp_telefon && (
              <a
                href={`https://wa.me/${business.whatsapp_telefon.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-xs font-medium text-neutral-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Doğrudan İletişime Geçin</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 ml-auto" />
              </a>
            )}
          </div>

        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-neutral-500 tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
        <span>Doğrulanmış Müşteri Değerlendirme Sistemi</span>
      </div>
    </main>
  );
}