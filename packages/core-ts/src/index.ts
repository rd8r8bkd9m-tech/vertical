export type MoneyKop = number;

export interface PlasteringInput {
  wallAreaM2: number;
  averageLayerMm: number;
  consumptionKgPerM2Per10Mm: number;
  wastePercent: number;
  bagWeightKg: number;
  bagPriceKop: MoneyKop;
  laborRateM2Kop: MoneyKop;
  primerRateM2Kop: MoneyKop;
  beaconRateM2Kop: MoneyKop;
  meshRateM2Kop: MoneyKop;
  liftRatePerBagFloorKop: MoneyKop;
  deliveryFixedKop: MoneyKop;
  riskReservePercent: number;
  targetMarginPercent: number;
  floor: number;
  hasElevator: boolean;
  includePrimer: boolean;
  includeBeacons: boolean;
  includeMesh: boolean;
  includeSlopes: boolean;
  materialByContractor: boolean;
}

export interface PlasteringResult {
  materialKg: number;
  bagsCount: number;
  materialCostKop: MoneyKop;
  laborCostKop: MoneyKop;
  primerCostKop: MoneyKop;
  beaconCostKop: MoneyKop;
  meshCostKop: MoneyKop;
  logisticsCostKop: MoneyKop;
  riskReserveKop: MoneyKop;
  internalCostKop: MoneyKop;
  marginKop: MoneyKop;
  totalClientPriceKop: MoneyKop;
  protectionScore: number;
}

export function rub(value: number): MoneyKop {
  return Math.round(value * 100);
}

export function formatRub(kop: MoneyKop): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(kop / 100);
}

export function calculatePlastering(input: PlasteringInput): PlasteringResult {
  if (input.wallAreaM2 <= 0 || input.averageLayerMm <= 0 || input.bagWeightKg <= 0) {
    throw new Error('Invalid plastering input');
  }

  const materialKg = input.wallAreaM2 * input.consumptionKgPerM2Per10Mm * (input.averageLayerMm / 10) * (1 + input.wastePercent / 100);
  const bagsCount = Math.ceil(materialKg / input.bagWeightKg);
  const materialCostKop = input.materialByContractor ? bagsCount * input.bagPriceKop : 0;
  const laborCostKop = Math.round(input.laborRateM2Kop * input.wallAreaM2);
  const primerCostKop = input.includePrimer ? Math.round(input.primerRateM2Kop * input.wallAreaM2) : 0;
  const beaconCostKop = input.includeBeacons ? Math.round(input.beaconRateM2Kop * input.wallAreaM2) : 0;
  const meshCostKop = input.includeMesh ? Math.round(input.meshRateM2Kop * input.wallAreaM2) : 0;
  const liftCostKop = !input.hasElevator && input.floor > 1 ? input.liftRatePerBagFloorKop * bagsCount * (input.floor - 1) : 0;
  const logisticsCostKop = input.deliveryFixedKop + liftCostKop;
  const internalCostKop = materialCostKop + laborCostKop + primerCostKop + beaconCostKop + meshCostKop + logisticsCostKop;
  const riskReserveKop = Math.round(internalCostKop * input.riskReservePercent / 100);
  const marginKop = Math.round((internalCostKop + riskReserveKop) * input.targetMarginPercent / 100);
  const totalClientPriceKop = internalCostKop + riskReserveKop + marginKop;
  const protectionScore = calculateProtectionScore(input);

  return { materialKg, bagsCount, materialCostKop, laborCostKop, primerCostKop, beaconCostKop, meshCostKop, logisticsCostKop, riskReserveKop, internalCostKop, marginKop, totalClientPriceKop, protectionScore };
}

export function calculateProtectionScore(input: PlasteringInput): number {
  const checks = [
    input.wallAreaM2 > 0,
    input.averageLayerMm > 0,
    input.consumptionKgPerM2Per10Mm > 0,
    input.bagWeightKg > 0,
    input.laborRateM2Kop >= 0,
    input.floor >= 1,
    input.includePrimer,
    input.includeBeacons,
    input.deliveryFixedKop >= 0,
    input.riskReservePercent >= 0
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
