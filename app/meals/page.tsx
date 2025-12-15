"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Apple, Plus, Search, ChefHat, Info, CheckCircle2, Sparkles, Activity, User } from "lucide-react"

export default function MealsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [successMessage, setSuccessMessage] = useState("")

  const [dailyTarget, setDailyTarget] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  const [currentIntake, setCurrentIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  const loadDailyData = () => {
    const goals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    if (goals.dailyCalories) {
      setDailyTarget({
        calories: goals.dailyCalories || 2000,
        protein: goals.protein || 100,
        carbs: goals.carbs || 250,
        fat: goals.fat || 60,
      })
    }

    const today = new Date().toISOString().split("T")[0]
    const foodLog = JSON.parse(localStorage.getItem(`foodLog_${today}`) || "[]")
    const totals = foodLog.reduce(
      (acc: any, item: any) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

    setCurrentIntake(totals)
  }

  useEffect(() => {
    loadDailyData()
  }, [])

  const addMealToTracker = (meal: any) => {
    const today = new Date().toISOString().split("T")[0]
    const foodLog = JSON.parse(localStorage.getItem(`foodLog_${today}`) || "[]")

    meal.items.forEach((item: any) => {
      const foodData = foodLibrary.find((f) => f.name === item.name)
      if (foodData) {
        const multiplier = item.amount / 100
        foodLog.push({
          id: Date.now().toString() + Math.random(),
          name: foodData.name,
          portion: item.amount,
          calories: foodData.calories * multiplier,
          protein: foodData.protein * multiplier,
          carbs: foodData.carbs * multiplier,
          fat: foodData.fat * multiplier,
          mealTime: meal.type,
        })
      }
    })

    localStorage.setItem(`foodLog_${today}`, JSON.stringify(foodLog))
    setSuccessMessage(`Menu "${meal.name}" berhasil ditambahkan ke tracker!`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const addToTracker = (food: any) => {
    const today = new Date().toISOString().split("T")[0]
    const foodLog = JSON.parse(localStorage.getItem(`foodLog_${today}`) || "[]")
    const multiplier = food.amount / food.servingSize
    foodLog.push({
      id: Date.now().toString() + Math.random(),
      name: food.name,
      portion: food.amount,
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fat: food.fat * multiplier,
    })

    localStorage.setItem(`foodLog_${today}`, JSON.stringify(foodLog))
    setSuccessMessage(`"${food.name}" berhasil ditambahkan ke tracker!`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const foodLibrary = [
    {
      id: 1,
      name: "Ayam Dada",
      category: "protein",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      description: "Tinggi protein, rendah lemak",
      servingSize: 100,
    },
    {
      id: 2,
      name: "Ikan Salmon",
      category: "protein",
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      description: "Kaya omega-3",
      servingSize: 100,
    },
    {
      id: 3,
      name: "Telur Ayam",
      category: "protein",
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      description: "Protein lengkap",
      servingSize: 100,
    },
    {
      id: 4,
      name: "Tempe",
      category: "protein",
      calories: 193,
      protein: 20,
      carbs: 9,
      fat: 8,
      description: "Sumber protein nabati",
      servingSize: 100,
    },
    {
      id: 5,
      name: "Tahu",
      category: "protein",
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
      description: "Protein nabati rendah kalori",
      servingSize: 100,
    },
    {
      id: 6,
      name: "Ikan Tuna",
      category: "protein",
      calories: 132,
      protein: 28,
      carbs: 0,
      fat: 1.3,
      description: "Tinggi protein, sangat rendah lemak",
      servingSize: 100,
    },
    {
      id: 7,
      name: "Nasi Putih",
      category: "carbs",
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      description: "Karbohidrat utama",
      servingSize: 100,
    },
    {
      id: 8,
      name: "Nasi Merah",
      category: "carbs",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      description: "Lebih tinggi serat",
      servingSize: 100,
    },
    {
      id: 9,
      name: "Kentang",
      category: "carbs",
      calories: 77,
      protein: 2,
      carbs: 17,
      fat: 0.1,
      description: "Karbohidrat kompleks",
      servingSize: 100,
    },
    {
      id: 10,
      name: "Ubi Jalar",
      category: "carbs",
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      description: "Kaya vitamin A",
      servingSize: 100,
    },
    {
      id: 11,
      name: "Roti Gandum",
      category: "carbs",
      calories: 247,
      protein: 13,
      carbs: 41,
      fat: 3.4,
      description: "Tinggi serat",
      servingSize: 100,
    },
    {
      id: 12,
      name: "Oatmeal",
      category: "carbs",
      calories: 389,
      protein: 17,
      carbs: 66,
      fat: 7,
      description: "Karbohidrat sehat",
      servingSize: 100,
    },
    {
      id: 13,
      name: "Pasta Gandum",
      category: "carbs",
      calories: 157,
      protein: 5.8,
      carbs: 30,
      fat: 0.9,
      description: "Karbohidrat kompleks",
      servingSize: 100,
    },
    {
      id: 14,
      name: "Brokoli",
      category: "vegetables",
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      description: "Kaya vitamin C",
      servingSize: 100,
    },
    {
      id: 15,
      name: "Bayam",
      category: "vegetables",
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      description: "Tinggi zat besi",
      servingSize: 100,
    },
    {
      id: 16,
      name: "Wortel",
      category: "vegetables",
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fat: 0.2,
      description: "Kaya beta-karoten",
      servingSize: 100,
    },
    {
      id: 17,
      name: "Tomat",
      category: "vegetables",
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      description: "Kaya likopen",
      servingSize: 100,
    },
    {
      id: 18,
      name: "Paprika",
      category: "vegetables",
      calories: 31,
      protein: 1,
      carbs: 6,
      fat: 0.3,
      description: "Kaya vitamin C",
      servingSize: 100,
    },
    {
      id: 19,
      name: "Pisang",
      category: "fruits",
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      description: "Energi cepat",
      servingSize: 100,
    },
    {
      id: 20,
      name: "Apel",
      category: "fruits",
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      description: "Tinggi serat",
      servingSize: 100,
    },
    {
      id: 21,
      name: "Alpukat",
      category: "fruits",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      description: "Lemak sehat",
      servingSize: 100,
    },
    {
      id: 22,
      name: "Jeruk",
      category: "fruits",
      calories: 47,
      protein: 0.9,
      carbs: 12,
      fat: 0.1,
      description: "Kaya vitamin C",
      servingSize: 100,
    },
    {
      id: 23,
      name: "Mangga",
      category: "fruits",
      calories: 60,
      protein: 0.8,
      carbs: 15,
      fat: 0.4,
      description: "Kaya vitamin A",
      servingSize: 100,
    },
    {
      id: 24,
      name: "Kacang Almond",
      category: "fats",
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      description: "Lemak sehat",
      servingSize: 100,
    },
    {
      id: 25,
      name: "Kacang Mete",
      category: "fats",
      calories: 553,
      protein: 18,
      carbs: 30,
      fat: 44,
      description: "Kaya magnesium",
      servingSize: 100,
    },
    {
      id: 26,
      name: "Minyak Zaitun",
      category: "fats",
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
      description: "Lemak tak jenuh",
      servingSize: 100,
    },
    {
      id: 27,
      name: "Susu",
      category: "dairy",
      calories: 42,
      protein: 3.4,
      carbs: 5,
      fat: 1,
      description: "Kaya kalsium",
      servingSize: 100,
    },
    {
      id: 28,
      name: "Yogurt Greek",
      category: "dairy",
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      description: "Tinggi protein",
      servingSize: 100,
    },
    {
      id: 29,
      name: "Keju Cottage",
      category: "dairy",
      calories: 98,
      protein: 11,
      carbs: 3.4,
      fat: 4.3,
      description: "Protein tinggi",
      servingSize: 100,
    },
  ]

  const filteredLibrary = foodLibrary.filter(
    (food) =>
      (selectedCategory === "all" || food.category === selectedCategory) &&
      food.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
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
                Profil
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
              <Link href="/meals" className="text-sm font-medium text-green-700 hover:text-green-600 transition-colors">
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
          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Generate Bundling Food section */}
          <Card className="border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Sparkles className="h-6 w-6 text-teal-600" />
                Rekomendasi Menu Harian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <Info className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-teal-900">
                    Dapatkan rekomendasi bundling makanan yang dipersonalisasi berdasarkan profil dan target kesehatan
                    Anda. Sistem akan menganalisis kebutuhan kalori, protein, karbohidrat, dan lemak harian Anda.
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-md">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Bundling Food
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Food Library */}
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <ChefHat className="h-6 w-6 text-emerald-600" />
                Perpustakaan Makanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari makanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "protein", "carbs", "vegetables", "fruits", "snacks", "drinks"].map((cat) => (
                    <Button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedCategory === cat
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "border-emerald-200 hover:bg-emerald-50"
                      }
                    >
                      {cat === "all"
                        ? "Semua"
                        : cat === "protein"
                          ? "Protein"
                          : cat === "carbs"
                            ? "Karbohidrat"
                            : cat === "vegetables"
                              ? "Sayuran"
                              : cat === "fruits"
                                ? "Buah"
                                : cat === "snacks"
                                  ? "Camilan"
                                  : "Minuman"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Food Items */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredLibrary.map((food) => (
                  <Card key={food.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{food.name}</h4>
                          <p className="text-xs text-gray-500">Per {food.servingSize}g</p>
                        </div>
                        <Apple className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-xs text-gray-600">Kalori</div>
                          <div className="font-semibold text-green-600">{food.calories} kkal</div>
                        </div>
                        <div className="bg-teal-50 p-2 rounded">
                          <div className="text-xs text-gray-600">Protein</div>
                          <div className="font-semibold text-teal-600">{food.protein}g</div>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded">
                          <div className="text-xs text-gray-600">Karbo</div>
                          <div className="font-semibold text-emerald-600">{food.carbs}g</div>
                        </div>
                        <div className="bg-cyan-50 p-2 rounded">
                          <div className="text-xs text-gray-600">Lemak</div>
                          <div className="font-semibold text-cyan-600">{food.fat}g</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => addToTracker(food)}
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah ke Tracker
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLibrary.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Apple className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Tidak ada makanan yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
