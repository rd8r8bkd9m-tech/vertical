import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculatePlastering, formatRub, rub } from '@vertical/core-ts';
import './styles.css';

type ActivityTone = 'blue' | 'green' | 'amber' | 'red';

const activities: Array<{
  tone: ActivityTone;
  label: string;
  title: string;
  subtitle: string;
  meta: string;
  badge?: string;
}> = [
  {
    tone: 'blue',
    label: 'Новая заявка',
    title: 'Иван Петров',
    subtitle: 'Штукатурка стен · ул. Ленина, 45',
    meta: '10 мин назад',
    badge: 'Авито'
  },
  {
    tone: 'blue',
    label: 'Замер сегодня',
    title: 'Амирово, 14:00',
    subtitle: 'Коттедж, внутренние работы',
    meta: '14:00',
    badge: 'Запланирован'
  },
  {
    tone: 'green',
    label: 'Смета отправлена',
    title: '145 000 ₽',
    subtitle: 'Квартира, 68 м²',
    meta: 'Вчера',
    badge: 'Ожидает ответа'
  },
  {
    tone: 'amber',
    label: 'Ожидается оплата',
    title: 'ЖК Солнечный',
    subtitle: 'Этап 2 · Монтаж перегородок',
    meta: '85 000 ₽',
    badge: '2 дня'
  }
];

const measurements = [
  ['14:00', 'Амирово', 'Коттедж, внутренние работы', 'Алексей Смирнов'],
  ['16:30', 'ЖК Парк Победы', 'Квартира, 68 м²', 'Мария Иванова'],
  ['18:00', 'Новая Рига, 12', 'Дом, фасадные работы', 'Дмитрий Волков']
];

const estimates = [
  ['ЖК Солнечный', 'Этап 2. Монтаж перегородок', '85 000 ₽', '2 дня назад'],
  ['Коттедж в Раздорах', 'Внутренние работы', '321 500 ₽', '3 дня назад'],
  ['ЖК Серебряный Бор', 'Черновые материалы', '142 000 ₽', '5 дней назад'],
  ['Офис на Тверской', 'Отделочные работы', '210 000 ₽', '7 дней назад']
];

function MetricCard(props: { title: string; value: string; hint: string; tone?: ActivityTone }) {
  return <article className={`metric-card tone-${props.tone ?? 'blue'}`}>
    <div className="metric-icon" />
    <p>{props.title}</p>
    <strong>{props.value}</strong>
    <span>{props.hint}</span>
  </article>;
}

function ActivityCard({ item }: { item: (typeof activities)[number] }) {
  return <article className="activity-card">
    <div className={`activity-icon tone-${item.tone}`} />
    <div className="activity-main">
      <div className="activity-topline">
        <span className={`tone-text tone-${item.tone}`}>{item.label}</span>
        {item.badge ? <em>{item.badge}</em> : null}
      </div>
      <strong>{item.title}</strong>
      <p>{item.subtitle}</p>
    </div>
    <div className="activity-meta">{item.meta}</div>
  </article>;
}

function PlasteringCalculator() {
  const [area, setArea] = useState(100);
  const [layer, setLayer] = useState(15);
  const [floor, setFloor] = useState(2);
  const [hasElevator, setHasElevator] = useState(false);
  const [includeSlopes, setIncludeSlopes] = useState(false);

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
    includeSlopes,
    materialByContractor: true
  }), [area, layer, floor, hasElevator, includeSlopes]);

  return <section className="calculator-panel">
    <div className="panel-head">
      <div>
        <p className="eyebrow">Штукатурный MVP</p>
        <h2>Быстрая цена</h2>
      </div>
      <span className="safe-badge">Защита {result.protectionScore}%</span>
    </div>

    <div className="quick-form">
      <label>Площадь стен<input type="number" value={area} onChange={e => setArea(Number(e.target.value))} /><span>м²</span></label>
      <label>Средний слой<input type="number" value={layer} onChange={e => setLayer(Number(e.target.value))} /><span>мм</span></label>
      <label>Этаж<input type="number" value={floor} onChange={e => setFloor(Number(e.target.value))} /><span>эт.</span></label>
    </div>

    <div className="toggles">
      <button className={hasElevator ? 'active' : ''} onClick={() => setHasElevator(value => !value)}>Лифт {hasElevator ? 'есть' : 'нет'}</button>
      <button className={includeSlopes ? 'active' : ''} onClick={() => setIncludeSlopes(value => !value)}>Откосы {includeSlopes ? 'включены' : 'не включены'}</button>
    </div>

    <div className="price-result">
      <p>Честная цена клиенту</p>
      <strong>{formatRub(result.totalClientPriceKop)}</strong>
      <span>Срок: 3–4 рабочих дня · {result.bagsCount} мешков · {result.materialKg.toFixed(1)} кг</span>
    </div>

    <div className="economy-grid">
      <div><span>Материал</span><b>{formatRub(result.materialCostKop)}</b></div>
      <div><span>Работа</span><b>{formatRub(result.laborCostKop)}</b></div>
      <div><span>Логистика</span><b>{formatRub(result.logisticsCostKop)}</b></div>
      <div><span>Маржа</span><b>{formatRub(result.marginKop)}</b></div>
    </div>
  </section>;
}

function App() {
  return <div className="product-shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">В</div>
        <div><strong>Вертикаль</strong><span>Смета без споров</span></div>
      </div>
      <nav>
        {['Сегодня', 'Заявки', 'Объекты', 'Сметы', 'Документы', 'Цены', 'Настройки'].map((item, index) =>
          <a key={item} className={index === 0 ? 'active' : ''}>{item}</a>
        )}
      </nav>
      <div className="support-card">
        <strong>Нужна помощь?</strong>
        <p>Поддержка по замерам и сметам</p>
        <button>Написать</button>
      </div>
    </aside>

    <main className="dashboard">
      <header className="topbar">
        <div className="search">Поиск по объектам, заявкам, сметам... <kbd>⌘ K</kbd></div>
        <div className="user-chip"><span className="bell">3</span><div className="avatar">В</div><div><b>Владислав</b><small>Руководитель</small></div></div>
      </header>

      <section className="mobile-brand">
        <div className="brand compact"><div className="brand-mark">В</div><div><strong>Вертикаль</strong><span>Смета без споров</span></div></div>
      </section>

      <section className="hero">
        <div>
          <h1>Доброе утро, Владислав</h1>
          <p>Сегодня 3 замера, 2 сметы ждут ответа</p>
        </div>
        <button className="primary-action">+ Новый замер</button>
      </section>

      <section className="quick-actions">
        {['+ Новый замер', 'Быстрая цена', 'Новая заявка', 'Создать КП'].map(action => <button key={action}>{action}</button>)}
      </section>

      <section className="metrics-row">
        <MetricCard title="Активные заявки" value="18" hint="+4 за сегодня" />
        <MetricCard title="Объекты в работе" value="7" hint="3 на стройке" />
        <MetricCard title="Сметы ждут ответа" value="12" hint="2 просрочено" tone="amber" />
        <MetricCard title="Маржа" value="24%" hint="+3% к прошл. мес." tone="green" />
      </section>

      <section className="content-grid">
        <div className="panel feed-panel">
          <div className="panel-title"><h2>Сегодня</h2><a>Смотреть все</a></div>
          {activities.map(item => <ActivityCard key={`${item.label}-${item.title}`} item={item} />)}
        </div>

        <div className="panel schedule-panel">
          <div className="panel-title"><h2>Замеры на сегодня</h2><a>Календарь</a></div>
          {measurements.map(([time, place, detail, client]) => <article className="schedule-item" key={time}>
            <time>{time}</time><div><strong>{place}</strong><p>{detail}</p><span>{client}</span></div><em>Запланирован</em>
          </article>)}
        </div>

        <PlasteringCalculator />

        <div className="panel estimates-panel">
          <div className="panel-title"><h2>Сметы ждут ответа</h2><a>Все сметы</a></div>
          {estimates.map(([title, desc, amount, age]) => <article className="estimate-row" key={title}>
            <div><strong>{title}</strong><p>{desc}</p></div><div><b>{amount}</b><span>{age}</span></div>
          </article>)}
        </div>
      </section>
    </main>

    <nav className="bottom-nav">
      {['Сегодня', 'Заявки', 'Объекты', 'Сметы', 'Ещё'].map((item, index) => <a key={item} className={index === 0 ? 'active' : ''}>{item}</a>)}
      <button>+</button>
    </nav>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
