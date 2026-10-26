"""
SMART SOLARGUARD: Fast, Physics-Grounded Solar Panel Dataset Generator
Generates realistic, physically-grounded sensor readings across 6 conditions:
1. NORMAL
2. SHADING
3. DUST
4. ELECTRICAL_FAULT
5. LOW_POWER
6. OVERHEATING
"""

import os
import csv
import random
import math

def generate_solar_dataset(samples_per_class: int = 800, output_path: str = None, seed: int = 42):
    random.seed(seed)
    data = []

    classes = [
        "NORMAL",
        "SHADING",
        "DUST",
        "ELECTRICAL_FAULT",
        "LOW_POWER",
        "OVERHEATING"
    ]

    for label in classes:
        for _ in range(samples_per_class):
            if label == "NORMAL":
                light = random.uniform(750.0, 1000.0)
                temp = random.uniform(25.0, 40.0)
                temp_factor = max(0.0, temp - 25.0) * 0.04
                voltage = random.uniform(18.2, 20.6) - temp_factor + random.gauss(0, 0.15)
                current = (light / 1000.0) * random.uniform(2.1, 2.4) + random.gauss(0, 0.04)

            elif label == "SHADING":
                light = random.uniform(300.0, 650.0)
                temp = random.uniform(22.0, 35.0)
                voltage = random.uniform(14.0, 17.5) + random.gauss(0, 0.25)
                current = random.uniform(0.35, 1.25) + random.gauss(0, 0.05)

            elif label == "DUST":
                light = random.uniform(720.0, 960.0)
                temp = random.uniform(30.0, 46.0)
                voltage = random.uniform(16.5, 18.5) + random.gauss(0, 0.2)
                current = (light / 1000.0) * random.uniform(1.2, 1.6) + random.gauss(0, 0.05)

            elif label == "ELECTRICAL_FAULT":
                light = random.uniform(650.0, 1000.0)
                temp = random.uniform(28.0, 50.0)
                voltage = random.uniform(5.5, 13.5) + random.gauss(0, 0.4)
                current = random.uniform(0.2, 1.5) + random.gauss(0, 0.08)

            elif label == "LOW_POWER":
                light = random.uniform(600.0, 850.0)
                temp = random.uniform(26.0, 38.0)
                voltage = random.uniform(12.5, 16.0) + random.gauss(0, 0.2)
                current = random.uniform(0.8, 1.4) + random.gauss(0, 0.05)

            elif label == "OVERHEATING":
                light = random.uniform(800.0, 1000.0)
                temp = random.uniform(55.0, 85.0)
                voltage = random.uniform(13.0, 16.2) + random.gauss(0, 0.25)
                current = random.uniform(1.8, 2.3) + random.gauss(0, 0.05)

            # Physical bounding
            v = max(0.0, round(voltage, 2))
            i = max(0.0, round(current, 2))
            t = round(temp, 1)
            l = round(light, 1)
            p = round(v * i, 2)

            data.append({
                "voltage": v,
                "current": i,
                "temperature": t,
                "light_intensity": l,
                "power": p,
                "fault_type": label
            })

    # Shuffle dataset
    random.shuffle(data)

    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "solar_panel_dataset.csv")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fieldnames = ["voltage", "current", "temperature", "light_intensity", "power", "fault_type"]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

    print(f"[OK] Generated {len(data)} samples across {len(classes)} classes.")
    print(f"[OK] Dataset saved to: {output_path}")
    return data

if __name__ == "__main__":
    generate_solar_dataset()
