"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Activity, User, ArrowLeft, TrendingUp, TrendingDown, Minus, Save } from "lucide-react"

export default function EditGoalsPage() {
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState("")

  const [profile, setProfile] = useState({
    weight: "",
    bmr: 0,
    tdee: 0,
  })

  const [formData, setFormData] = useState({
    targetWeight: "",
    timeFrame: "",
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    const savedGoals = localStorage.getItem("weightGoals")

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile({
        weight: parsed.weight,
        bmr: parsed.bmr,
        tdee: parsed.tdee,
      })
    }

    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setSelectedGoal(parsed.goalType)
      setFormData({
        targetWeight: parsed.targetWeight,
        timeFrame: parsed.timeFrame,
      })
    }
  }, [])

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal)
    // Reset form if switching goal type
    if (goal === "maintain") {
      setFormData({ targetWeight: "", timeFrame: "" })
    }
  }

  const handleSaveGoals = () => {
    if (!selectedGoal) {
      alert("Silakan pilih tujuan terlebih dahulu")
      return
    }

    // For maintain, no need for target weight and timeframe
    if (selectedGoal === "maintain") {
      setShowConfirmDialog(true)
      return
    }

    // For lose/gain, validate inputs
    if (!formData.targetWeight || !formData.timeFrame) {
      alert("Silakan isi target berat badan dan jangka waktu")
      return
    }

    const currentWeight = Number.parseFloat(profile.weight)
    const targetWeight = Number.parseFloat(formData.targetWeight)

    // Validate target weight based on goal
    if (selectedGoal === "lose" && targetWeight >= currentWeight) {
      alert("Target berat badan harus lebih rendah dari berat saat ini untuk menurunkan berat badan")
      return
    }

    if (selectedGoal === "gain" && targetWeight <= currentWeight) {
      alert("Target berat badan harus lebih tinggi dari berat saat ini untuk menaikkan berat badan")
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmSaveGoals = () => {
    const currentWeight = Number.parseFloat(profile.weight)
    let updatedGoals

    if (selectedGoal === "maintain") {
      // For maintain, use TDEE as daily calories
      updatedGoals = {
        goalType: "maintain",
        targetWeight: profile.weight,
        timeFrame: "",
        dailyCalories: profile.tdee,
        protein: Math.round((profile.tdee * 0.25) / 4),
        carbs: Math.round((profile.tdee * 0.5) / 4),
        fat: Math.round((profile.tdee * 0.25) / 9),
      }
    } else {
      // For lose/gain
      const targetWeight = Number.parseFloat(formData.targetWeight)
      const timeFrameWeeks = Number.parseFloat(formData.timeFrame)
      const timeFrameDays = timeFrameWeeks * 7

      const weightDiff = Math.abs(targetWeight - currentWeight)

      // Calculate calorie adjustment (1 kg = 7700 calories)
      const totalCalorieAdjustment = weightDiff * 7700
      const dailyCalorieAdjustment = totalCalorieAdjustment / timeFrameDays

      let dailyCalories = profile.tdee
      if (selectedGoal === "gain") {
        dailyCalories += dailyCalorieAdjustment
      } else if (selectedGoal === "lose") {
        dailyCalories -= dailyCalorieAdjustment

        // Safety check: daily calories should not be below BMR
        if (dailyCalories < profile.bmr) {
          alert(
            `Peringatan: Defisit kalori terlalu besar!\n\nKalori harian Anda (${Math.round(dailyCalories)} kkal) tidak boleh lebih rendah dari BMR (${Math.round(profile.bmr)} kkal).\n\nSilakan tingkatkan jangka waktu atau kurangi target penurunan berat badan.`,
          )
          setShowConfirmDialog(false)
          return
        }
      }

      // Calculate macros (25% protein, 50% carbs, 25% fat)
      const protein = (dailyCalories * 0.25) / 4
      const carbs = (dailyCalories * 0.5) / 4
      const fat = (dailyCalories * 0.25) / 9

      updatedGoals = {
        goalType: selectedGoal,
        targetWeight: formData.targetWeight,
        timeFrame: formData.timeFrame,
        dailyCalories,
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
      }
    }

    // Save to localStorage
    localStorage.setItem("weightGoals", JSON.stringify(updatedGoals))

    setShowConfirmDialog(false)
    alert("Target berhasil diperbarui!")
    router.push("/profile/goals")
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
          <Link href="/profile/goals">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Goals
            </Button>
          </Link>

          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Update Target & Goals</h2>
            <p className="text-gray-600">Ubah tujuan kesehatan Anda dan dapatkan rencana nutrisi yang baru</p>
          </div>

          {/* Update Goals Form */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle>Perbarui Target Anda</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Weight Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Berat Badan Saat Ini:</span> {profile.weight} kg
                </p>
              </div>

              {/* Goal Selection */}
              <div>
                <Label className="text-base mb-3 block">Pilih Tujuan Anda</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleGoalSelect("lose")}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedGoal === "lose"
                        ? "border-red-500 bg-red-50 shadow-lg"
                        : "border-gray-200 hover:border-red-300 bg-white"
                    }`}
                  >
                    <TrendingDown
                      className={`h-8 w-8 mx-auto mb-3 ${selectedGoal === "lose" ? "text-red-600" : "text-gray-400"}`}
                    />
                    <div className="font-semibold text-gray-900">Turunkan Berat Badan</div>
                    <div className="text-sm text-gray-500 mt-1">Defisit kalori</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoalSelect("gain")}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedGoal === "gain"
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <TrendingUp
                      className={`h-8 w-8 mx-auto mb-3 ${selectedGoal === "gain" ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <div className="font-semibold text-gray-900">Naikkan Berat Badan</div>
                    <div className="text-sm text-gray-500 mt-1">Surplus kalori</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoalSelect("maintain")}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedGoal === "maintain"
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 hover:border-green-300 bg-white"
                    }`}
                  >
                    <Minus
                      className={`h-8 w-8 mx-auto mb-3 ${selectedGoal === "maintain" ? "text-green-600" : "text-gray-400"}`}
                    />
                    <div className="font-semibold text-gray-900">Pertahankan Berat Badan</div>
                    <div className="text-sm text-gray-500 mt-1">Kalori seimbang</div>
                  </button>
                </div>
              </div>

              {/* Target Weight & Timeframe (only for lose/gain) */}
              {(selectedGoal === "lose" || selectedGoal === "gain") && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="targetWeight">Target Berat Badan (kg)</Label>
                      <Input
                        id="targetWeight"
                        type="number"
                        step="0.1"
                        placeholder="60"
                        value={formData.targetWeight}
                        onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                        className="h-12"
                      />
                      <p className="text-sm text-gray-500">Masukkan target berat badan yang ingin dicapai</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="timeFrame">Jangka Waktu (minggu)</Label>
                      <Input
                        id="timeFrame"
                        type="number"
                        placeholder="8"
                        value={formData.timeFrame}
                        onChange={(e) => setFormData({ ...formData, timeFrame: e.target.value })}
                        className="h-12"
                      />
                      <p className="text-sm text-gray-500">Rentang sehat: 4-12 minggu</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <span className="font-semibold">Catatan:</span> Sistem akan memastikan defisit/surplus kalori Anda
                      aman dan tidak melebihi batas BMR.
                    </p>
                  </div>
                </div>
              )}

              {/* Maintain Info */}
              {selectedGoal === "maintain" && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-900">
                    Anda akan mempertahankan berat badan saat ini dengan mengonsumsi kalori sesuai TDEE Anda (
                    {Math.round(profile.tdee)} kkal/hari).
                  </p>
                </div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSaveGoals}
                disabled={!selectedGoal}
                className="w-full h-14 text-base bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
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
            <AlertDialogTitle>Konfirmasi Perubahan Target</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin memperbarui target berat badan Anda? Perubahan ini akan mempengaruhi rencana
              nutrisi harian, rekomendasi makanan, dan seluruh sistem tracking Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSaveGoals}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
            >
              Ya, Perbarui
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
