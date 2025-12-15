"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, User, Target, ArrowLeft, Edit3 } from "lucide-react"

export default function GoalsPage() {
  const router = useRouter()

  const [profile, setProfile] = useState({
    weight: "",
  })

  const [goals, setGoals] = useState({
    goalType: "",
    targetWeight: "",
    timeFrame: "",
    dailyCalories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    const savedGoals = localStorage.getItem("weightGoals")

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile({
        weight: parsed.weight,
      })
    }

    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoals(parsed)
    }
  }, [])

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
          {/* Back Button */}
          <Link href="/profile">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Profil
            </Button>
          </Link>

          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Target & Goals Anda</h2>
            <p className="text-gray-600">Lihat target kesehatan dan rencana nutrisi harian Anda</p>
          </div>

          {/* Current Goals Display */}
          {goals.goalType ? (
            <>
              <Card className="border-teal-100">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-teal-600" />
                    Target Saat Ini
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tujuan</div>
                      <div className="text-lg font-semibold text-gray-900 capitalize">
                        {goals.goalType === "lose" && "Turunkan Berat Badan"}
                        {goals.goalType === "gain" && "Naikkan Berat Badan"}
                        {goals.goalType === "maintain" && "Pertahankan Berat Badan"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Berat Saat Ini</div>
                      <div className="text-lg font-semibold text-gray-900">{profile.weight} kg</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Target Berat</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {goals.targetWeight ? `${goals.targetWeight} kg` : "-"}
                      </div>
                    </div>
                  </div>

                  {goals.timeFrame && goals.timeFrame > 0 && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-1">Jangka Waktu</div>
                      <div className="text-lg font-semibold text-gray-900">{goals.timeFrame} minggu</div>
                    </div>
                  )}

                  {/* Nutrition Insights */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Rencana Nutrisi Harian:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Kalori</div>
                        <div className="text-2xl font-bold text-teal-600">{Math.round(goals.dailyCalories)}</div>
                        <div className="text-xs text-gray-500">kkal</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Protein</div>
                        <div className="text-2xl font-bold text-green-600">{goals.protein}</div>
                        <div className="text-xs text-gray-500">gram</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Karbohidrat</div>
                        <div className="text-2xl font-bold text-emerald-600">{goals.carbs}</div>
                        <div className="text-xs text-gray-500">gram</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Lemak</div>
                        <div className="text-2xl font-bold text-amber-600">{goals.fat}</div>
                        <div className="text-xs text-gray-500">gram</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Goals Button */}
              <div className="flex justify-center">
                <Link href="/profile/goals/edit">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                  >
                    <Edit3 className="h-5 w-5 mr-2" />
                    Update Goals
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Target</h3>
                <p className="text-gray-600 mb-6">Anda belum menetapkan target kesehatan. Mulai sekarang!</p>
                <Link href="/profile/goals/edit">
                  <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                    <Target className="h-4 w-4 mr-2" />
                    Tetapkan Target
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
