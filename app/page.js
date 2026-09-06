export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-2">NFC Değerlendirme Sistemi</h1>
      <p className="text-neutral-400 text-sm max-w-sm">
        İşletme sayfasına erişmek için doğrudan NFC kart bağlantısını kullanın (örnek: <code className="text-amber-400">/test-berber</code>).
      </p>
    </main>
  );
}