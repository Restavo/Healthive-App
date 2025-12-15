"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, User, Search, Plus, Trash2, Calendar } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  portion: number
  calories: number
  protein: number
  carbs: number
  fat: number
  mealTime: string
}

export default function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMealTime, setSelectedMealTime] = useState("all")
  const [foodLog, setFoodLog] = useState<FoodItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<any>(null)
  const [portion, setPortion] = useState("")
  const [mealTime, setMealTime] = useState("breakfast")

  // Daily targets from localStorage
  const [dailyTarget, setDailyTarget] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  // Load data on mount
  useEffect(() => {
    loadDailyTargets()
    loadFoodLog()
  }, [selectedDate])

  const loadDailyTargets = () => {
    const goals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    if (goals.dailyCalories) {
      setDailyTarget({
        calories: goals.dailyCalories || 2000,
        protein: goals.protein || 100,
        carbs: goals.carbs || 250,
        fat: goals.fat || 60,
      })
    }
  }

  const loadFoodLog = () => {
    const log = JSON.parse(localStorage.getItem(`foodLog_${selectedDate}`) || "[]")
    setFoodLog(log)
  }

  const saveFoodLog = (log: FoodItem[]) => {
    localStorage.setItem(`foodLog_${selectedDate}`, JSON.stringify(log))
    setFoodLog(log)
  }

  // Simple food database (per 100g)
  const foodDatabase = [
    { name: "Nasi Putih", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { name: "Ayam Dada", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Telur Ayam", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: "Tempe", calories: 193, protein: 20, carbs: 9, fat: 8 },
    { name: "Tahu", calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
    { name: "Brokoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    { name: "Pisang", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: "Apel", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    { name: "Kentang", calories: 77, protein: 2, carbs: 17, fat: 0.1 },
    { name: "Ikan Salmon", calories: 208, protein: 20, carbs: 0, fat: 13 },
    { name: "Bayam", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: "Wortel", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    { name: "Alpukat", calories: 160, protein: 2, carbs: 9, fat: 15 },
    { name: "Roti Gandum", calories: 247, protein: 13, carbs: 41, fat: 3.4 },
    { name: "Oatmeal", calories: 389, protein: 17, carbs: 66, fat: 7 },
    { name: "Susu", calories: 42, protein: 3.4, carbs: 5, fat: 1 },
    { name: "Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    { name: "Kacang Almond", calories: 579, protein: 21, carbs: 22, fat: 50 },
  ]

  const filteredFoods = foodDatabase.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addFoodToLog = () => {
    if (!selectedFood || !portion) {
      alert("Pilih makanan dan masukkan porsi")
      return
    }

    const portionMultiplier = Number.parseFloat(portion) / 100
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: selectedFood.name,
      portion: Number.parseFloat(portion),
      calories: selectedFood.calories * portionMultiplier,
      protein: selectedFood.protein * portionMultiplier,
      carbs: selectedFood.carbs * portionMultiplier,
      fat: selectedFood.fat * portionMultiplier,
      mealTime,
    }

    const updatedLog = [...foodLog, newItem]
    saveFoodLog(updatedLog)

    // Reset form
    setSelectedFood(null)
    setPortion("")
    setSearchTerm("")
  }

  const removeFoodFromLog = (id: string) => {
    const updatedLog = foodLog.filter((item) => item.id !== id)
    saveFoodLog(updatedLog)
  }

  // Calculate totals
  const filteredLog =
    selectedMealTime === "all" ? foodLog : foodLog.filter((item) => item.mealTime === selectedMealTime)

  const totals = filteredLog.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  const allDayTotals = foodLog.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

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
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                Beranda
              </Link>
              <Link
                href="/tracker"
                className="text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pelacak Makanan</h2>
            <p className="text-gray-600">Catat asupan makanan harian Anda per gram</p>
          </div>

          {/* Date & Filter Section */}
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealFilter">Filter Waktu Makan</Label>
                  <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="breakfast">Sarapan</SelectItem>
                      <SelectItem value="lunch">Makan Siang</SelectItem>
                      <SelectItem value="dinner">Makan Malam</SelectItem>
                      <SelectItem value="snack">Camilan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Summary */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Hari Ini</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Kalori</div>
                  <div className="text-xl font-bold text-green-600">
                    {Math.round(allDayTotals.calories)} / {Math.round(dailyTarget.calories)}
                  </div>
                  <div className="text-xs text-gray-500">kkal</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="text-xl font-bold text-teal-600">
                    {Math.round(allDayTotals.protein)} / {dailyTarget.protein}
                  </div>
                  <div className="text-xs text-gray-500">gram</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Karbohidrat</div>
                  <div className="text-xl font-bold text-emerald-600">
                    {Math.round(allDayTotals.carbs)} / {dailyTarget.carbs}
                  </div>
                  <div className="text-xs text-gray-500">gram</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Lemak</div>
                  <div className="text-xl font-bold text-cyan-600">
                    {Math.round(allDayTotals.fat)} / {dailyTarget.fat}
                  </div>
                  <div className="text-xs text-gray-500">gram</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Food Section */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Tambah Makanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchFood">Cari Makanan</Label>
                <Input
                  id="searchFood"
                  placeholder="Ketik nama makanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {searchTerm && filteredFoods.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredFoods.map((food, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedFood(food)
                        setSearchTerm(food.name)
                      }}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-gray-500">
                        Per 100g: {food.calories} kkal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFood && (
                <div className="p-4 bg-green-50 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedFood.name}</h4>
                    <p className="text-sm text-gray-600">Nilai nutrisi per 100 gram</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="portion">Porsi (gram)</Label>
                      <Input
                        id="portion"
                        type="number"
                        placeholder="100"
                        value={portion}
                        onChange={(e) => setPortion(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mealTime">Waktu Makan</Label>
                      <Select value={mealTime} onValueChange={setMealTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Sarapan</SelectItem>
                          <SelectItem value="lunch">Makan Siang</SelectItem>
                          <SelectItem value="dinner">Makan Malam</SelectItem>
                          <SelectItem value="snack">Camilan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {portion && (
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Nutrisi untuk {portion}g:</p>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Kalori:</span>
                          <div className="font-semibold">
                            {Math.round((selectedFood.calories * Number.parseFloat(portion)) / 100)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Protein:</span>
                          <div className="font-semibold">
                            {Math.round((selectedFood.protein * Number.parseFloat(portion)) / 100)}g
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Karbo:</span>
                          <div className="font-semibold">
                            {Math.round((selectedFood.carbs * Number.parseFloat(portion)) / 100)}g
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Lemak:</span>
                          <div className="font-semibold">
                            {Math.round((selectedFood.fat * Number.parseFloat(portion)) / 100)}g
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={addFoodToLog}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah ke Log Hari Ini
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Food Log Section */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle>
                Log Makanan{" "}
                {selectedMealTime !== "all" &&
                  `- ${
                    selectedMealTime === "breakfast"
                      ? "Sarapan"
                      : selectedMealTime === "lunch"
                        ? "Makan Siang"
                        : selectedMealTime === "dinner"
                          ? "Makan Malam"
                          : "Camilan"
                  }`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {filteredLog.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada makanan yang dicatat untuk hari ini</div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {filteredLog.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.portion}g |{" "}
                            {item.mealTime === "breakfast"
                              ? "Sarapan"
                              : item.mealTime === "lunch"
                                ? "Makan Siang"
                                : item.mealTime === "dinner"
                                  ? "Makan Malam"
                                  : "Camilan"}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Kalori</div>
                            <div className="text-xl font-bold text-green-600">{Math.round(item.calories)} kkal</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Protein</div>
                            <div className="text-xl font-bold text-teal-600">{Math.round(item.protein)}g</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Karbo</div>
                            <div className="text-xl font-bold text-emerald-600">{Math.round(item.carbs)}g</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Lemak</div>
                            <div className="text-xl font-bold text-cyan-600">{Math.round(item.fat)}g</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFoodFromLog(item.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Total {selectedMealTime === "all" ? "Hari Ini" : "Waktu Makan Ini"}:
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Kalori</div>
                        <div className="text-2xl font-bold text-green-600">{Math.round(totals.calories)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Protein</div>
                        <div className="text-2xl font-bold text-teal-600">{Math.round(totals.protein)}g</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Karbo</div>
                        <div className="text-2xl font-bold text-emerald-600">{Math.round(totals.carbs)}g</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Lemak</div>
                        <div className="text-2xl font-bold text-cyan-600">{Math.round(totals.fat)}g</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 text-center">
                <Link href="/report">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    Lihat Laporan Hari Ini
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Link */}
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-4">Tidak yakin harus makan apa?</p>
            <Link href="/meals">
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                Lihat Rekomendasi Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
