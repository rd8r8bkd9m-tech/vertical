import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculatePlastering, formatRub, rub } from '@vertical/core-ts';
import './styles.css';

function App() {
  const [area, setArea] = useState(100);
  const [layer, setLayer] = useState(15);
  const [floor, setFloor] = useState(2);
  const [hasElevator, setHasElevator] = useState(false);

  const result = useMemo(() => calculatePlastering({
    wallAreaM2: area,
    averageLayerMm: layer,
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
    floor,
    hasElevator,
    includePrimer: true,
    includeBeacons: true,
    includeMesh: false,
    includeSlopes: false,
    materialByContractor: true
  }), [area, layer, floor, hasElevator]);

  return <main className="app-shell">
    <section className="hero-card">
      <div>
        <p className="eyebrow">Вертикаль · штукатурный MVP</p>
        <h1>Смета без споров</h1>
        <p className="muted">Замерил. Посчитал. Объяснил. Закрыл.</p>
      </div>
      <button className="primary-button">+ Новый замер</button>
    </section>

    <section className="grid">
      <div className="card form-card">
        <h2>Быстрый замер</h2>
        <label>Площадь стен, м²<input type="number" value={area} onChange={e => setArea(Number(e.target.value))} /></label>
        <label>Средний слой, мм<input type="number" value={layer} onChange={e => setLayer(Number(e.target.value))} /></label>
        <label>Этаж<input type="number" value={floor} onChange={e => setFloor(Number(e.target.value))} /></label>
        <label className="check"><input type="checkbox" checked={hasElevator} onChange={e => setHasElevator(e.target.checked)} /> Есть лифт</label>
      </div>

      <div className="card price-card">
        <p className="eyebrow">Честная цена</p>
        <div className="price">{formatRub(result.totalClientPriceKop)}</div>
        <div className="score">Смета защищена: {result.protectionScore}%</div>
        <div className="rows">
          <span>Материал</span><b>{formatRub(result.materialCostKop)}</b>
          <span>Работа</span><b>{formatRub(result.laborCostKop)}</b>
          <span>Логистика</span><b>{formatRub(result.logisticsCostKop)}</b>
          <span>Маржа</span><b>{formatRub(result.marginKop)}</b>
        </div>
      </div>
    </section>

    <section className="card">
      <h2>Расчёт материала</h2>
      <div className="estimate-line"><span>Гипсовая смесь</span><strong>{result.bagsCount} мешков</strong></div>
      <div className="estimate-line"><span>Вес материала</span><strong>{result.materialKg.toFixed(1)} кг</strong></div>
      <div className="estimate-line"><span>Внутренняя себестоимость</span><strong>{formatRub(result.internalCostKop)}</strong></div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
