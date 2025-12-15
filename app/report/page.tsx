"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Activity, User, TrendingUp, Calendar, BarChart3 } from "lucide-react"

export default function ReportPage() {
  const [dateRange, setDateRange] = useState<"today" | "7days" | "30days">("today")
  const [dataType, setDataType] = useState<"calories" | "protein" | "carbs" | "fat">("calories")
  const [reportData, setReportData] = useState({
    dailyLogs: [] as any[],
    weeklyAverage: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    monthlyAverage: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    totalDays: 0,
    streak: 0,
    weightProgress: [] as any[],
  })
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = () => {
    const days = dateRange === "today" ? 1 : dateRange === "7days" ? 7 : 30
    const logs = []
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let daysWithData = 0

    // Get goals for target
    const savedGoals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    const dailyTarget = savedGoals.dailyCalories || 2000

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayLog = JSON.parse(localStorage.getItem(`foodLog_${dateString}`) || "[]")

      if (dayLog.length > 0) {
        const dayTotals = dayLog.reduce(
          (acc: any, item: any) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        )

        logs.push({
          date: dateString,
          ...dayTotals,
        })

        totalCalories += dayTotals.calories
        totalProtein += dayTotals.protein
        totalCarbs += dayTotals.carbs
        totalFat += dayTotals.fat
        daysWithData++
      } else {
        logs.push({
          date: dateString,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        })
      }
    }

    const avgCalories = daysWithData > 0 ? totalCalories / daysWithData : 0
    const avgProtein = daysWithData > 0 ? totalProtein / daysWithData : 0
    const avgCarbs = daysWithData > 0 ? totalCarbs / daysWithData : 0
    const avgFat = daysWithData > 0 ? totalFat / daysWithData : 0
    const targetMet =
      daysWithData > 0 ? logs.filter((log) => Math.abs(log.calories - dailyTarget) < dailyTarget * 0.1).length : 0

    setReportData({
      dailyLogs: logs.reverse(),
      weeklyAverage: { calories: avgCalories, protein: avgProtein, carbs: avgCarbs, fat: avgFat },
      monthlyAverage: { calories: avgCalories, protein: avgProtein, carbs: avgCarbs, fat: avgFat },
      totalDays: daysWithData,
      streak: targetMet,
      weightProgress: [],
    })
  }

  const renderMultiTypeChart = () => {
    const { dailyLogs } = reportData

    if (dailyLogs.length === 0) {
      return <div className="text-center py-12 text-gray-500">Belum ada data untuk ditampilkan</div>
    }

    const types = [
      { key: "calories", label: "Kalori", color: "bg-green-600", unit: "kkal" },
      { key: "protein", label: "Protein", color: "bg-teal-600", unit: "g" },
      { key: "carbs", label: "Karbo", color: "bg-emerald-600", unit: "g" },
      { key: "fat", label: "Lemak", color: "bg-cyan-600", unit: "g" },
    ]

    return (
      <div className="space-y-6">
        {types.map((type) => {
          const maxValue = Math.max(...dailyLogs.map((log) => log[type.key] || 0))

          return (
            <div key={type.key} className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
                {type.label}
              </h4>
              <div className="space-y-1">
                {dailyLogs.map((log, idx) => {
                  const value = log[type.key] || 0
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
                  const date = new Date(log.date)
                  const dateLabel = date.toLocaleDateString("id-ID", { month: "short", day: "numeric" })

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-gray-600">{dateLabel}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${type.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">
                            {Math.round(value)} {type.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTodayPieChart = () => {
    const { dailyLogs } = reportData

    if (dailyLogs.length === 0) {
      return <div className="text-center py-12 text-gray-500">Belum ada data untuk hari ini</div>
    }

    const todayLog = dailyLogs[0]
    const total = todayLog.calories + todayLog.protein + todayLog.carbs + todayLog.fat

    if (total === 0) {
      return <div className="text-center py-12 text-gray-500">Belum ada data nutrisi hari ini</div>
    }

    const data = [
      {
        label: "Kalori",
        value: todayLog.calories,
        color: "#86EFAC", // Soft green
        percentage: (todayLog.calories / total) * 100,
      },
      {
        label: "Protein",
        value: todayLog.protein,
        color: "#7DD3FC", // Soft sky blue
        percentage: (todayLog.protein / total) * 100,
      },
      {
        label: "Karbo",
        value: todayLog.carbs,
        color: "#FCD34D", // Soft amber
        percentage: (todayLog.carbs / total) * 100,
      },
      {
        label: "Lemak",
        value: todayLog.fat,
        color: "#F9A8D4", // Soft pink
        percentage: (todayLog.fat / total) * 100,
      },
    ]

    const goals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    const targetCalories = goals.dailyCalories || 2000
    const targetProtein = goals.proteinTarget || 150
    const targetCarbs = goals.carbsTarget || 200
    const targetFat = goals.fatTarget || 60

    const targets = [
      { label: "Kalori", current: todayLog.calories, target: targetCalories, unit: "kkal", color: "emerald" },
      { label: "Protein", current: todayLog.protein, target: targetProtein, unit: "g", color: "blue" },
      { label: "Karbo", current: todayLog.carbs, target: targetCarbs, unit: "g", color: "amber" },
      { label: "Lemak", current: todayLog.fat, target: targetFat, unit: "g", color: "pink" },
    ]

    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 200 200" className="transform -rotate-90">
              {(() => {
                let currentAngle = 0
                return data.map((item, idx) => {
                  const angle = (item.percentage / 100) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle
                  currentAngle = endAngle

                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180

                  const x1 = 100 + 90 * Math.cos(startRad)
                  const y1 = 100 + 90 * Math.sin(startRad)
                  const x2 = 100 + 90 * Math.cos(endRad)
                  const y2 = 100 + 90 * Math.sin(endRad)

                  const largeArc = angle > 180 ? 1 : 0

                  const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 90 90 0 ${largeArc} 1 ${x2} ${y2}`, `Z`].join(" ")

                  return (
                    <path
                      key={idx}
                      d={pathData}
                      fill={item.color}
                      stroke="white"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="cursor-pointer transition-opacity hover:opacity-90"
                    />
                  )
                })
              })()}
            </svg>

            {/* Tooltip in center - shows hovered segment data or nothing */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {hoveredSegment !== null ? (
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-medium text-gray-700">{data[hoveredSegment].label}</div>
                  <div className="text-xl font-bold text-gray-900">{Math.round(data[hoveredSegment].value)}</div>
                  <div className="text-xs text-gray-600">{Math.round(data[hoveredSegment].percentage)}%</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-600">
                  {Math.round(item.value)} ({Math.round(item.percentage)}%)
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-700">Progress Target Hari Ini</h4>
          {targets.map((target, idx) => {
            const progress = Math.min((target.current / target.target) * 100, 100)
            const currentDisplay = Math.round(target.current)
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700">{target.label}</span>
                  <span className="text-gray-600">
                    {currentDisplay} / {target.target} {target.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-full rounded-full bg-${target.color}-400 transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const { dailyLogs, weeklyAverage, monthlyAverage, totalDays, streak } = reportData

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
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
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                Pelacak Makanan
              </Link>
              <Link href="/meals" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                Rencana Makan
              </Link>
              <Link
                href="/report"
                className="text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
              >
                Laporan
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Laporan Kesehatan</h2>
            <p className="text-gray-600">Visualisasi progres dan statistik nutrisi Anda</p>
          </div>

          {/* Current Status Overview */}
          {/* Placeholder for profile and goals data */}
          {/* You can add logic to fetch and display profile and goals data here */}

          {/* Report Filters */}
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRange">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Rentang Waktu
                  </Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                      <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataType">Tipe Data</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calories">Kalori</SelectItem>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="carbs">Karbohidrat</SelectItem>
                      <SelectItem value="fat">Lemak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Summary */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                Statistik{" "}
                {dateRange === "today" ? "Hari Ini" : dateRange === "7days" ? "7 Hari Terakhir" : "30 Hari Terakhir"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Kalori</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(dateRange === "today" ? dailyLogs[0]?.calories || 0 : weeklyAverage.calories)}
                  </div>
                  <div className="text-xs text-gray-500">kkal/hari</div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Protein</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {Math.round(dateRange === "today" ? dailyLogs[0]?.protein || 0 : weeklyAverage.protein)}
                  </div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Karbo</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(dateRange === "today" ? dailyLogs[0]?.carbs || 0 : weeklyAverage.carbs)}
                  </div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Lemak</div>
                  <div className="text-2xl font-bold text-cyan-600">
                    {Math.round(dateRange === "today" ? dailyLogs[0]?.fat || 0 : weeklyAverage.fat)}
                  </div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Pencapaian Target:</strong> Anda mencapai target kalori harian pada{" "}
                  <strong className="text-teal-600">{streak}</strong> dari <strong>{totalDays}</strong> hari.
                  {totalDays > 0 && <> ({Math.round((streak / totalDays) * 100)}%)</>}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                {dateRange === "today" ? "Visualisasi Hari Ini" : "Visualisasi Historis"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {dateRange === "today"
                ? // Show pie chart and progress for today
                  renderTodayPieChart()
                : // Show multi-type bar charts for 7 days and 30 days
                  renderMultiTypeChart()}
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-green-100 bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Wawasan & Rekomendasi</h3>
              <div className="space-y-3">
                {dailyLogs.length > 0 ? (
                  <>
                    {dateRange !== "today" && weeklyAverage.calories > 0 && (
                      <>
                        {weeklyAverage.calories <
                          (JSON.parse(localStorage.getItem("weightGoals") || "{}").dailyCalories || 2000) * 0.9 && (
                          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>⚠️ Asupan Kalori Kurang:</strong> Rata-rata asupan kalori Anda di bawah target.
                              Pertimbangkan untuk menambah porsi atau camilan sehat.
                            </p>
                          </div>
                        )}

                        {weeklyAverage.calories >
                          (JSON.parse(localStorage.getItem("weightGoals") || "{}").dailyCalories || 2000) * 1.1 && (
                          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>⚠️ Asupan Kalori Berlebih:</strong> Rata-rata asupan kalori Anda melebihi target.
                              Perhatikan porsi dan pilih makanan rendah kalori.
                            </p>
                          </div>
                        )}

                        {weeklyAverage.protein < 50 && (
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>💪 Tingkatkan Protein:</strong> Asupan protein Anda masih rendah. Tambahkan sumber
                              protein seperti ayam, ikan, telur, atau tempe.
                            </p>
                          </div>
                        )}

                        {streak >= totalDays * 0.7 && (
                          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>🎉 Konsistensi Bagus!</strong> Anda berhasil mencapai target pada sebagian besar
                              hari. Pertahankan kebiasaan baik ini!
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {dateRange === "today" && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>ℹ️ Mulai Catat Makanan:</strong> Belum ada data untuk periode ini. Mulai catat asupan
                          makanan Anda untuk melihat wawasan yang lebih detail.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>ℹ️ Mulai Catat Makanan:</strong> Belum ada data untuk periode ini. Mulai catat asupan
                      makanan Anda untuk melihat wawasan yang lebih detail.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/profile" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
              >
                Perbarui Profil & Target
              </Button>
            </Link>
            <Link href="/tracker" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                Lacak Makanan Hari Ini
              </Button>
            </Link>
            <Link href="/meals" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
              >
                Sesuaikan Rencana Makan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
