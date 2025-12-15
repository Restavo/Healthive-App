"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, User, Target, Edit, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    bmi: 0,
    bmiCategory: "",
    bmr: 0,
    tdee: 0,
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
    }
  }, [])

  const getActivityLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      sedentary: "Sangat Ringan (1.2)",
      light: "Ringan (1.375)",
      moderate: "Sedang (1.55)",
      active: "Aktif (1.725)",
      extra: "Sangat Aktif (1.9)",
    }
    return labels[level] || level
  }

  const getGenderLabel = (gender: string) => {
    return gender === "male" ? "Laki-laki" : "Perempuan"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
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
                className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Profil Kesehatan</h2>
            <p className="text-gray-600">Lihat data kesehatan dan informasi profil Anda</p>
          </div>

          {/* Profile Data Display */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Data Diri
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Nama</div>
                  <div className="text-lg font-semibold text-gray-900">{profile.name || "-"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Jenis Kelamin</div>
                  <div className="text-lg font-semibold text-gray-900">{getGenderLabel(profile.gender) || "-"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Usia</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.age ? `${profile.age} tahun` : "-"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Tinggi Badan</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.height ? `${profile.height} cm` : "-"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Berat Badan</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.weight ? `${profile.weight} kg` : "-"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Tingkat Aktivitas</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {getActivityLabel(profile.activityLevel) || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Insights */}
          <Card className="border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                Insight Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Body Mass Index (BMI)</div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {profile.bmi ? profile.bmi.toFixed(1) : "-"}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{profile.bmiCategory || "-"}</div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Basal Metabolic Rate (BMR)</div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {profile.bmr ? Math.round(profile.bmr) : "-"}
                  </div>
                  <div className="text-sm font-medium text-gray-700">kkal/hari</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Total Daily Energy Expenditure (TDEE)</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {profile.tdee ? Math.round(profile.tdee) : "-"}
                  </div>
                  <div className="text-sm font-medium text-gray-700">kkal/hari</div>
                </div>
              </div>

              {profile.bmiCategory && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Kategori {profile.bmiCategory}:</strong>{" "}
                    {profile.bmiCategory === "Underweight" &&
                      "Tingkatkan asupan nutrisi seimbang dan konsultasikan dengan ahli gizi."}
                    {profile.bmiCategory === "Normal" &&
                      "Pertahankan pola makan seimbang dan rutin beraktivitas fisik."}
                    {profile.bmiCategory === "Overweight" &&
                      "Kurangi kalori secara bertahap dan tingkatkan aktivitas fisik."}
                    {profile.bmiCategory.includes("Obesity") &&
                      "Konsultasikan dengan dokter untuk program penurunan berat badan yang aman."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/profile/goals">
              <Button className="w-full h-24 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-lg">
                <Target className="h-6 w-6 mr-3" />
                Kelola Target & Goals
              </Button>
            </Link>

            <Link href="/profile/edit">
              <Button className="w-full h-24 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg">
                <Edit className="h-6 w-6 mr-3" />
                Update Data Profil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
