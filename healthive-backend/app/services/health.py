# ======================
# BASIC METABOLIC LOGIC
# ======================

def calculate_bmi(weight: float, height: float) -> float:
    height_m = height / 100
    return round(weight / (height_m ** 2), 2)


def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """
    Mifflin-St Jeor Equation
    """
    if gender == "Laki-laki":
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161


def calculate_tdee(bmr: float, activity_level: str) -> float:
    multiplier = {
        "Kurang Aktif": 1.2,
        "Sedikit Aktif": 1.375,
        "Cukup Aktif": 1.55,
        "Sangat Aktif": 1.725,
        "Ekstra Aktif": 1.9
    }
    return bmr * multiplier[activity_level]


# ======================
# MACRO & CALORIE LOGIC
# ======================

def calculate_macro_targets(
    weight: float,
    height: float,
    age: int,
    gender: str,
    activity_level: str,
    goal: str,
    target_weight: float,
    duration_months: int
):
    """
    Menghitung:
    - Target kalori harian (dengan safety BMR)
    - Target makronutrien (protein, karbohidrat, lemak)
    """

    # 1. Hitung BMR & TDEE
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)

    # 2. Hitung penyesuaian kalori berdasarkan target berat
    weight_diff = target_weight - weight
    total_calorie_change = weight_diff * 7700
    days = duration_months * 30
    adjustment = abs(total_calorie_change / days)

    # 3. Target kalori harian (safety: tidak boleh < BMR)
    if goal == "lose":
        target_calories = max(tdee - adjustment, bmr)
    elif goal == "gain":
        target_calories = tdee + adjustment
    else:
        target_calories = tdee

    # 4. Distribusi makronutrien
    protein_g = (target_calories * 0.25) / 4
    carbs_g = (target_calories * 0.50) / 4
    fat_g = (target_calories * 0.25) / 9

    return {
        "bmi": calculate_bmi(weight, height),
        "bmr": round(bmr),
        "tdee": round(tdee),
        "daily_target_calories": round(target_calories),
        "protein_target_g": round(protein_g),
        "carbs_target_g": round(carbs_g),
        "fat_target_g": round(fat_g),
    }
