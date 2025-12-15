"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Target, Apple, TrendingUp, Bell, Calculator, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [todaySummary, setTodaySummary] = useState({
    bmiStatus: "-",
    bmiValue: 0,
    currentCalories: 0,
    targetCalories: 0,
    targetWeight: "-",
    currentWeight: 0,
  })

  useEffect(() => {
    const setupComplete = localStorage.getItem("setupComplete")
    if (!setupComplete) {
      router.push("/setup")
    }

    loadTodaySummary()
  }, [router])

  const loadTodaySummary = () => {
    try {
      // Get profile data
      const profileData = localStorage.getItem("healthProfile")
      const goalsData = localStorage.getItem("weightGoals")
      const todayDate = new Date().toISOString().split("T")[0]
      const dailyIntake = localStorage.getItem(`dailyIntake_${todayDate}`)

      let bmiStatus = "-"
      let bmiValue = 0
      let currentCalories = 0
      let targetCalories = 0
      let targetWeight = "-"
      let currentWeight = 0

      // Calculate BMI and status
      if (profileData) {
        const profile = JSON.parse(profileData)
        const heightInMeters = profile.height / 100
        bmiValue = profile.weight / (heightInMeters * heightInMeters)
        currentWeight = profile.weight

        if (bmiValue < 18.5) {
          bmiStatus = "Underweight"
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
          bmiStatus = "Normal"
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
          bmiStatus = "Overweight"
        } else {
          bmiStatus = "Obesitas"
        }
      }

      if (goalsData) {
        const goals = JSON.parse(goalsData)
        targetCalories = Math.round(goals.dailyCalories || 0)

        // Format target weight with calculation
        if (goals.targetWeight) {
          const targetWeightNum = goals.targetWeight
          const difference = Math.abs(currentWeight - targetWeightNum)
          targetWeight = `${targetWeightNum} kg`
        }
      }

      // Get today's consumed calories
      if (dailyIntake) {
        const intake = JSON.parse(dailyIntake)
        currentCalories = Math.round(intake.calories || 0)
      }

      setTodaySummary({
        bmiStatus: `${bmiStatus} (${bmiValue.toFixed(1)})`,
        bmiValue,
        currentCalories,
        targetCalories,
        targetWeight,
        currentWeight,
      })
    } catch (error) {
      console.error("Error loading today's summary:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                HEALTHIVE
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
              <Link href="/" className="text-sm font-medium text-green-700 hover:text-green-600 transition-colors">
                Beranda
              </Link>
              <Link
                href="/tracker"
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                Pelacak Makanan
              </Link>
              <Link href="/meals" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                Rencana Makan
              </Link>
              <Link href="/report" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                Laporan
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-green-100 rounded-full">
              <span className="text-sm font-medium text-green-700">Nutrisi Personal, Progres Terukur</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-balance">
              Capai Berat Badan Ideal dengan Panduan Nutrisi Personal
            </h2>
            <p className="text-lg text-gray-600 text-pretty">
              Healthive membantu Anda mengelola asupan nutrisi harian, menghitung BMI, BMR, dan TDEE, serta
              memvisualisasikan progres kesehatan dalam satu platform terpadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl overflow-hidden">
              <img
                src="https://placehold.co/600x600?text=Healthy+lifestyle+nutrition+tracking+app+interface+with+fresh+vegetables+fruits+and+person+exercising"
                alt="Aplikasi pelacakan nutrisi dengan tampilan makanan sehat dan orang berolahraga"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Fitur Utama Healthive</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola nutrisi dan mencapai target berat badan ideal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Profil Kesehatan</h4>
              <p className="text-gray-600 mb-4">
                Hitung BMI, BMR, dan kategori kesehatan Anda secara otomatis berdasarkan data tubuh
              </p>
              <Link href="/profile">
                <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
                  Atur Profil Saya →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Target Berat Badan</h4>
              <p className="text-gray-600 mb-4">
                Tetapkan target berat badan ideal dan dapatkan rekomendasi nutrisi harian yang personal
              </p>
              <Link href="/profile#goals">
                <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-0">
                  Tetapkan Target →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Apple className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Pelacak Makanan</h4>
              <p className="text-gray-600 mb-4">
                Catat makanan harian per gram dan pantau asupan kalori serta makronutrien Anda
              </p>
              <Link href="/tracker">
                <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0">
                  Lacak Makanan Hari Ini →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-lime-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Rencana Makan</h4>
              <p className="text-gray-600 mb-4">
                Dapatkan rekomendasi menu makanan sehat yang disesuaikan dengan target Anda
              </p>
              <Link href="/meals">
                <Button variant="ghost" className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 p-0">
                  Lihat Rekomendasi →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Laporan Progres</h4>
              <p className="text-gray-600 mb-4">
                Visualisasi progres kesehatan Anda dengan grafik dan statistik yang mudah dipahami
              </p>
              <Link href="/report">
                <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 p-0">
                  Lihat Laporan Lengkap →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Pengingat Sehat</h4>
              <p className="text-gray-600 mb-4">
                Tetap konsisten dengan pengingat otomatis untuk catat makanan dan cek progres
              </p>
              <Link href="/report#reminder">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                  Atur Pengingat →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Today's Summary Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ringkasan Hari Ini</h3>
              <p className="text-gray-600">Pantau progres kesehatan Anda secara real-time</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Status BMI</div>
                <div className="text-2xl font-bold text-green-600">{todaySummary.bmiStatus}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {todaySummary.bmiValue > 0 ? `Berat saat ini: ${todaySummary.currentWeight} kg` : "Belum ada data"}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Kalori Hari Ini</div>
                <div className="text-2xl font-bold text-teal-600">
                  {todaySummary.currentCalories} / {todaySummary.targetCalories}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {todaySummary.targetCalories > 0
                    ? `${Math.round((todaySummary.currentCalories / todaySummary.targetCalories) * 100)}% dari target`
                    : "kkal"}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Target Berat</div>
                <div className="text-2xl font-bold text-emerald-600">{todaySummary.targetWeight}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {todaySummary.targetWeight !== "-"
                    ? `Selisih: ${Math.abs(
                        todaySummary.currentWeight - Number.parseFloat(todaySummary.targetWeight),
                      ).toFixed(1)} kg`
                    : "Belum diatur"}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/report">
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                  Lihat Laporan Lengkap
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Motivation Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Tetap Termotivasi dengan Healthive</h3>
          <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto">
            Dapatkan pengingat cerdas dan wawasan progres mingguan untuk menjaga konsistensi perjalanan kesehatan Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Mulai Perjalanan Sehat
              </Button>
            </Link>
            <Link href="/report">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 bg-transparent"
              >
                Lihat Progres Saya
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">HEALTHIVE</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform manajemen nutrisi dan berat badan berbasis data untuk gaya hidup sehat Anda.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/profile" className="hover:text-green-400 transition-colors">
                    Profil Kesehatan
                  </Link>
                </li>
                <li>
                  <Link href="/tracker" className="hover:text-green-400 transition-colors">
                    Pelacak Makanan
                  </Link>
                </li>
                <li>
                  <Link href="/meals" className="hover:text-green-400 transition-colors">
                    Rencana Makan
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-green-400 transition-colors">
                    Laporan Progres
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tentang</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Disclaimer Medis
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Healthive. Platform Manajemen Nutrisi Personal.</p>
            <p className="mt-2">
              Healthive bukan pengganti diagnosis medis profesional. Konsultasikan dengan dokter untuk kondisi kesehatan
              khusus.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
