"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ArrowRight, ArrowLeft, Target, Utensils, Heart, Loader2, TrendingUp } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  const [name, setName] = useState("")
  const [gender, setGender] = useState("")

  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("")

  const [bmi, setBmi] = useState(0)
  const [bmr, setBmr] = useState(0)
  const [tdee, setTdee] = useState(0)
  const [bmiCategory, setBmiCategory] = useState("")

  const [goal, setGoal] = useState("")
  const [targetWeight, setTargetWeight] = useState("")
  const [duration, setDuration] = useState("")
  const [calorieAdjustment, setCalorieAdjustment] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  const [isCalculating, setIsCalculating] = useState(false)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [calculatedCalories, setCalculatedCalories] = useState(0)

  const [dailyCalories, setDailyCalories] = useState(0)
  const [protein, setProtein] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fat, setFat] = useState(0)

  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  }

  const activityLabels: { [key: string]: string } = {
    sedentary: "Kurang Aktif",
    light: "Sedikit Aktif",
    moderate: "Cukup Aktif",
    active: "Sangat Aktif",
    extra: "Ekstra Aktif",
  }

  const calculateMetrics = () => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseInt(age)

    const heightInMeters = h / 100
    const calculatedBmi = w / (heightInMeters * heightInMeters)
    setBmi(Number.parseFloat(calculatedBmi.toFixed(1)))

    let category = ""
    if (calculatedBmi < 18.5) category = "Kekurangan Berat Badan"
    else if (calculatedBmi >= 18.5 && calculatedBmi < 25) category = "Normal"
    else if (calculatedBmi >= 25 && calculatedBmi < 30) category = "Kelebihan Berat Badan"
    else if (calculatedBmi >= 30 && calculatedBmi < 35) category = "Obesitas I"
    else if (calculatedBmi >= 35 && calculatedBmi < 40) category = "Obesitas II"
    else category = "Obesitas III"
    setBmiCategory(category)

    let calculatedBmr = 0
    if (gender === "male") {
      calculatedBmr = 88.4 + 13.4 * w + 4.8 * h - 5.68 * a
    } else {
      calculatedBmr = 447.6 + 9.25 * w + 3.1 * h - 4.33 * a
    }
    setBmr(Math.round(calculatedBmr))

    const multiplier = activityMultipliers[activityLevel] || 1.2
    const calculatedTdee = calculatedBmr * multiplier
    setTdee(Math.round(calculatedTdee))
  }

  const calculateCalorieAdjustment = async () => {
    if (!targetWeight || !duration) {
      alert("Mohon lengkapi target berat badan dan jangka waktu")
      return
    }

    setIsCalculating(true)
    setHasCalculated(false)

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const currentW = Number.parseFloat(weight)
    const targetW = Number.parseFloat(targetWeight)
    const weeks = Number.parseInt(duration)

    const weightDiff = Math.abs(targetW - currentW)
    const totalCalories = weightDiff * 7700
    const days = weeks * 7
    const dailyAdjustment = Math.round(totalCalories / days)

    setCalorieAdjustment(dailyAdjustment)

    let targetCalories = tdee
    if (goal === "lose") {
      targetCalories = tdee - dailyAdjustment
      if (targetCalories < bmr) {
        setShowWarning(true)
        setIsCalculating(false)
        return
      }
    } else if (goal === "gain") {
      targetCalories = tdee + dailyAdjustment
    }

    setCalculatedCalories(Math.round(targetCalories))
    setShowWarning(false)
    setIsCalculating(false)
    setHasCalculated(true)
  }

  const calculateNutritionPlan = () => {
    let targetCalories = tdee

    if (goal === "lose") {
      targetCalories = tdee - calorieAdjustment
    } else if (goal === "gain") {
      targetCalories = tdee + calorieAdjustment
    }

    setDailyCalories(Math.round(targetCalories))

    const proteinCal = targetCalories * 0.25
    const carbsCal = targetCalories * 0.5
    const fatCal = targetCalories * 0.25

    setProtein(Math.round(proteinCal / 4))
    setCarbs(Math.round(carbsCal / 4))
    setFat(Math.round(fatCal / 9))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name || !gender) {
        alert("Mohon lengkapi semua data")
        return
      }
    }

    if (currentStep === 2) {
      if (!age || !weight || !height || !activityLevel) {
        alert("Mohon lengkapi semua data")
        return
      }
      calculateMetrics()
    }

    if (currentStep === 4) {
      if (goal === "maintain") {
        // For maintain, calculate directly
        setCalorieAdjustment(0)
        setCalculatedCalories(tdee)
        setHasCalculated(true)
        calculateNutritionPlan()
        // Skip to step 5 (which is now final step)
        setCurrentStep(5)
        return
      } else if (goal === "lose" || goal === "gain") {
        if (!hasCalculated) {
          alert("Silakan klik tombol Hitung untuk melihat hasil perhitungan kalori")
          return
        }
      } else {
        alert("Mohon pilih tujuan Anda")
        return
      }
      calculateNutritionPlan()
    }

    if (currentStep === 5) {
      const healthProfile = {
        name,
        gender,
        age: Number.parseInt(age),
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
        activityLevel,
        bmi,
        bmr,
        tdee,
        bmiCategory,
      }

      const weightGoals = {
        goalType: goal,
        targetWeight: goal === "maintain" ? Number.parseFloat(weight) : Number.parseFloat(targetWeight),
        timeFrame: goal === "maintain" ? 0 : Number.parseInt(duration),
        calorieAdjustment,
        dailyCalories,
        protein,
        carbs,
        fat,
      }

      localStorage.setItem("healthProfile", JSON.stringify(healthProfile))
      localStorage.setItem("weightGoals", JSON.stringify(weightGoals))
      localStorage.setItem("setupComplete", "true")

      router.push("/")
      return
    }

    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        setHasCalculated(false)
        setCalculatedCalories(0)
      }
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Perkenalan"
      case 2:
        return "Data Fisik"
      case 3:
        return "Hasil Perhitungan"
      case 4:
        return "Tujuan Anda"
      case 5:
        return "Rencana Nutrisi Anda"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-700">{getStepTitle()}</CardTitle>
            <CardDescription>Langkah {currentStep} dari 5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="mb-3 block text-base font-medium">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="mb-3 block text-base font-medium">Jenis Kelamin</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                        gender === "male"
                          ? "border-emerald-600 bg-emerald-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.75 2.25H21.75V8.25M21 3L14.25 9.75M10.5 10.5C11.2956 11.2956 11.2956 12.5711 10.5 13.3667C9.70442 14.1623 8.42893 14.1623 7.63335 13.3667C6.83777 12.5711 6.83777 11.2956 7.63335 10.5C8.42893 9.70442 9.70442 9.70442 10.5 10.5ZM10.5 10.5V21.75M10.5 21.75H7.5M10.5 21.75H13.5"
                          stroke={gender === "male" ? "#059669" : "#9CA3AF"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`font-semibold text-lg ${gender === "male" ? "text-emerald-700" : "text-gray-600"}`}
                      >
                        Laki-laki
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                        gender === "female"
                          ? "border-emerald-600 bg-emerald-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2.25C13.7902 2.25 15.5071 2.96116 16.773 4.22703C18.0388 5.4929 18.75 7.20979 18.75 9C18.75 10.7902 18.0388 12.5071 16.773 13.773C15.5071 15.0388 13.7902 15.75 12 15.75M12 15.75C10.2098 15.75 8.4929 15.0388 7.22703 13.773C5.96116 12.5071 5.25 10.7902 5.25 9C5.25 7.20979 5.96116 5.4929 7.22703 4.22703C8.4929 2.96116 10.2098 2.25 12 2.25M12 15.75V21.75M12 21.75H8.25M12 21.75H15.75"
                          stroke={gender === "female" ? "#059669" : "#9CA3AF"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`font-semibold text-lg ${gender === "female" ? "text-emerald-700" : "text-gray-600"}`}
                      >
                        Perempuan
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Data */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="age" className="mb-3 block text-base font-medium">
                    Usia (tahun)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Contoh: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="weight" className="mb-3 block text-base font-medium">
                    Berat Badan (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 70.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="mb-3 block text-base font-medium">
                    Tinggi Badan (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Contoh: 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="mb-3 block text-base font-medium">Tingkat Aktivitas Harian</Label>
                  <div className="space-y-3">
                    {Object.entries(activityLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActivityLevel(key)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          activityLevel === key
                            ? "border-emerald-600 bg-emerald-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-emerald-300"
                        }`}
                      >
                        <div className="font-semibold text-base text-gray-800">{label}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {key === "sedentary" && "Jarang atau tidak pernah olahraga"}
                          {key === "light" && "Olahraga ringan 1-3 hari/minggu"}
                          {key === "moderate" && "Olahraga sedang 3-5 hari/minggu"}
                          {key === "active" && "Olahraga berat 6-7 hari/minggu"}
                          {key === "extra" && "Olahraga berat 6-7 hari + pekerjaan fisik"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {currentStep === 3 && (
              <div className="space-y-6 text-center">
                <CheckCircle2 className="h-20 w-20 text-emerald-600 mx-auto" />
                <h3 className="text-3xl font-bold text-gray-900">Hasil Perhitungan Anda</h3>
                <p className="text-lg text-gray-600">
                  Berikut adalah analisis kesehatan Anda berdasarkan data yang diberikan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-emerald-700 mb-2">BMI</div>
                      <div className="text-4xl font-bold text-emerald-600">{bmi}</div>
                      <div className="text-sm font-medium text-emerald-500 mt-2">{bmiCategory}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-teal-200 bg-teal-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-teal-700 mb-2">BMR</div>
                      <div className="text-4xl font-bold text-teal-600">{bmr}</div>
                      <div className="text-sm font-medium text-teal-500 mt-2">kkal/hari</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-blue-700 mb-2">TDEE</div>
                      <div className="text-4xl font-bold text-blue-600">{tdee}</div>
                      <div className="text-sm font-medium text-blue-500 mt-2">kkal/hari</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Penjelasan Singkat</h4>
                  <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                    <li>
                      <strong>BMI (Body Mass Index):</strong> Ukuran yang membandingkan berat badan Anda dengan tinggi
                      badan untuk mengklasifikasikan status berat badan (kurus, normal, gemuk).
                    </li>
                    <li>
                      <strong>BMR (Basal Metabolic Rate):</strong> Jumlah kalori yang dibakar tubuh Anda saat istirahat
                      total untuk fungsi vital seperti bernapas dan sirkulasi darah.
                    </li>
                    <li>
                      <strong>TDEE (Total Daily Energy Expenditure):</strong> Perkiraan total kalori yang Anda bakar
                      dalam sehari, termasuk BMR dan aktivitas fisik. Ini adalah patokan untuk asupan kalori harian
                      Anda.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-base font-medium">Apa Tujuan Anda?</Label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGoal("lose")
                        setHasCalculated(false)
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        goal === "lose"
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-semibold text-base text-gray-800">Turunkan Berat Badan</div>
                          <div className="text-sm text-gray-500">Defisit kalori untuk menurunkan berat</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGoal("gain")
                        setHasCalculated(false)
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        goal === "gain"
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-semibold text-base text-gray-800">Naikkan Berat Badan</div>
                          <div className="text-sm text-gray-500">Surplus kalori untuk menaikkan berat</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGoal("maintain")
                        setHasCalculated(false)
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        goal === "maintain"
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-semibold text-base text-gray-800">Pertahankan Berat Badan</div>
                          <div className="text-sm text-gray-500">Kalori seimbang untuk maintain</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {(goal === "lose" || goal === "gain") && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetWeight">Target Berat Badan (kg)</Label>
                        <Input
                          id="targetWeight"
                          type="number"
                          step="0.1"
                          placeholder="60"
                          value={targetWeight}
                          onChange={(e) => {
                            setTargetWeight(e.target.value)
                            setHasCalculated(false)
                          }}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Jangka Waktu (minggu)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="8"
                          value={duration}
                          onChange={(e) => {
                            setDuration(e.target.value)
                            setHasCalculated(false)
                          }}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={calculateCalorieAdjustment}
                      disabled={isCalculating || !targetWeight || !duration}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Menghitung...
                        </>
                      ) : (
                        "Hitung Kalori Yang Dibutuhkan"
                      )}
                    </Button>

                    {hasCalculated && !showWarning && (
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Hasil Perhitungan
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Kalori Harian Yang Dibutuhkan</div>
                            <div className="text-3xl font-bold text-emerald-600">{calculatedCalories}</div>
                            <div className="text-sm text-gray-500 mt-1">kkal/hari</div>
                          </div>
                          <p className="text-sm text-gray-700">
                            {goal === "lose"
                              ? `Anda perlu defisit ${calorieAdjustment} kalori per hari untuk mencapai target.`
                              : `Anda perlu surplus ${calorieAdjustment} kalori per hari untuk mencapai target.`}
                          </p>
                        </div>
                      </div>
                    )}

                    {showWarning && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">
                          <strong>⚠️ Peringatan:</strong> Defisit kalori terlalu besar! Kalori harian tidak boleh lebih
                          rendah dari BMR ({bmr} kkal). Silakan tingkatkan jangka waktu atau kurangi target penurunan
                          berat badan.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 5: Final Summary (was step 6) */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl">
                  <Utensils className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Rencana Nutrisi Harian Anda</h3>
                  <p className="text-gray-600">
                    Berikut adalah target makronutrien yang disesuaikan dengan tujuan Anda
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-emerald-700 mb-2">Kalori</div>
                      <div className="text-3xl font-bold text-emerald-600">{dailyCalories}</div>
                      <div className="text-xs text-gray-500 mt-1">kkal/hari</div>
                    </CardContent>
                  </Card>

                  <Card className="border-teal-200 bg-teal-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-teal-700 mb-2">Protein</div>
                      <div className="text-3xl font-bold text-teal-600">{protein}</div>
                      <div className="text-xs text-gray-500 mt-1">gram/hari</div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-green-700 mb-2">Karbohidrat</div>
                      <div className="text-3xl font-bold text-green-600">{carbs}</div>
                      <div className="text-xs text-gray-500 mt-1">gram/hari</div>
                    </CardContent>
                  </Card>

                  <Card className="border-cyan-200 bg-cyan-50">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-cyan-700 mb-2">Lemak</div>
                      <div className="text-3xl font-bold text-cyan-600">{fat}</div>
                      <div className="text-xs text-gray-500 mt-1">gram/hari</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">Distribusi Makronutrien</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Protein (25%)</span>
                      <span className="font-semibold">{protein}g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Karbohidrat (50%)</span>
                      <span className="font-semibold">{carbs}g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lemak (25%)</span>
                      <span className="font-semibold">{fat}g</span>
                    </div>
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200 text-left">
                  <AlertDescription className="text-green-800">
                    <strong>🎉 Siap Memulai!</strong> Profil kesehatan Anda telah tersimpan. Gunakan tracker makanan
                    untuk mencatat asupan harian dan lihat progres Anda!
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button onClick={handleBack} variant="outline" className="flex-1 h-12 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {currentStep === 5 ? "Selesai" : "Lanjut"}
            {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
