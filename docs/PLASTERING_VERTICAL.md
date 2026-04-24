# Plastering Vertical

## Goal

Первый модуль — механизированная штукатурка стен.

## Inputs

- wall area m2
- average layer mm
- consumption kg per m2 per 10mm
- bag weight kg
- bag price
- labor rate per m2
- floor
- elevator
- carry distance
- include primer
- include beacons
- include mesh
- include slopes

## Calculations

```text
materialKg = area * consumption * layer / 10 * wasteCoef
bags = ceil(materialKg / bagWeightKg)
materialCost = bags * bagPrice
laborCost = area * laborRate
liftCost = bags * floorRate if no elevator
```

## Antidop checklist

- layer specified
- base specified
- material owner specified
- lift specified
- slopes decision specified
- primer decision specified
- beacons decision specified
- hidden defects condition included
