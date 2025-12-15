"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Activity, User, ArrowLeft, Save } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
  })

  const [goalType, setGoalType] = useState("")

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    const savedGoals = localStorage.getItem("weightGoals")

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
    }

    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoalType(parsed.goalType || "")
    }
  }, [])

  const handleUpdate = () => {
    if (
      !profile.name ||
      !profile.gender ||
      !profile.age ||
      !profile.weight ||
      !profile.height ||
      !profile.activityLevel
    ) {
      alert("Mohon lengkapi semua data")
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmUpdate = () => {
    const weight = Number.parseFloat(profile.weight)
    const height = Number.parseFloat(profile.height) / 100
    const age = Number.parseFloat(profile.age)

    const bmiValue = weight / (height * height)

    let category = ""
    if (bmiValue < 18.5) category = "Underweight"
    else if (bmiValue < 25) category = "Normal"
    else if (bmiValue < 30) category = "Overweight"
    else if (bmiValue < 35) category = "Obesity I"
    else if (bmiValue < 40) category = "Obesity II"
    else category = "Obesity III"

    let bmrValue = 0
    if (profile.gender === "male") {
      bmrValue = 88.4 + 13.4 * weight + 4.8 * Number.parseFloat(profile.height) - 5.68 * age
    } else {
      bmrValue = 447.6 + 9.25 * weight + 3.1 * Number.parseFloat(profile.height) - 4.33 * age
    }

    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9,
    }

    const tdeeValue = bmrValue * (activityMultipliers[profile.activityLevel] || 1.2)

    const updatedProfile = {
      ...profile,
      bmi: bmiValue,
      bmiCategory: category,
      bmr: bmrValue,
      tdee: tdeeValue,
    }
    localStorage.setItem("healthProfile", JSON.stringify(updatedProfile))

    setShowConfirmDialog(false)
    alert("Data berhasil diperbarui!")
    router.push("/profile")
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
          {/* Back Button */}
          <Link href="/profile">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Profil
            </Button>
          </Link>

          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Update Data Profil</h2>
            <p className="text-gray-600">Perbarui informasi kesehatan dan preferensi Anda</p>
          </div>

          {/* Edit Form */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Data Diri
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama Anda"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age">Usia (tahun)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Jenis Kelamin</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: "male" })}
                    className={`flex-1 h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      profile.gender === "male"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="10" cy="14" r="6" strokeWidth="2" />
                      <path d="M14 4l6 0 0 6M20 4l-8 8" strokeWidth="2" />
                    </svg>
                    <span className="font-semibold">Laki-laki</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: "female" })}
                    className={`flex-1 h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      profile.gender === "female"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300 bg-white"
                    }`}
                  >
                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="9" r="6" strokeWidth="2" />
                      <path d="M12 15v8M9 20h6" strokeWidth="2" />
                    </svg>
                    <span className="font-semibold">Perempuan</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="weight">Berat Badan (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="65"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="activity">Tingkat Aktivitas</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih tingkat aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sangat Ringan (1.2)</SelectItem>
                    <SelectItem value="light">Ringan (1.375)</SelectItem>
                    <SelectItem value="moderate">Sedang (1.55)</SelectItem>
                    <SelectItem value="active">Aktif (1.725)</SelectItem>
                    <SelectItem value="extra">Sangat Aktif (1.9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdate}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin memperbarui data profil Anda? Perubahan ini akan mempengaruhi perhitungan BMI,
              BMR, TDEE, dan rekomendasi nutrisi Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpdate}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              Ya, Perbarui
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
