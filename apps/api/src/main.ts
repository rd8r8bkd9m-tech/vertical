import Fastify from 'fastify';
import { calculatePlastering, rub } from '@vertical/core-ts';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok', product: 'vertical' }));

app.post('/api/v1/plastering/calculate', async (request) => {
  const body = request.body as Partial<{ wallAreaM2: number; averageLayerMm: number; floor: number; hasElevator: boolean }>;
  return calculatePlastering({
    wallAreaM2: body.wallAreaM2 ?? 100,
    averageLayerMm: body.averageLayerMm ?? 15,
    consumptionKgPerM2Per10Mm: 8.5,
    wastePercent: 10,
    bagWeightKg: 30,
    bagPriceKop: rub(480),
    laborRateM2Kop: rub(550),
    primerRateM2Kop: rub(45),
    beaconRateM2Kop: rub(90),
    meshRateM2Kop: rub(120),
    liftRatePerBagFloorKop: rub(35),
    deliveryFixedKop: rub(6000),
    riskReservePercent: 5,
    targetMarginPercent: 15,
    floor: body.floor ?? 1,
    hasElevator: body.hasElevator ?? false,
    includePrimer: true,
    includeBeacons: true,
    includeMesh: false,
    includeSlopes: false,
    materialByContractor: true
  });
});

const port = Number(process.env.PORT ?? 4000);
await app.listen({ host: '0.0.0.0', port });
