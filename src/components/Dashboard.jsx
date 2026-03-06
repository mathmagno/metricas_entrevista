import { useState, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

// ─── Dados brutos — mensais por campanha e ano ───────────────────────────────
// Campanha A: CTR alto, mas CPA pior (mais cliques, conversão menor)
// Campanha B: CTR menor, mas ROAS e CPA melhores (conversão mais eficiente)
// 2024 → 2025: melhora geral de performance em ambas as campanhas

const DADOS_BRUTOS = [
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { ano: 2024, mes: 'Janeiro',  campanha: 'Campanha A', impressoes: 220000, cliques: 3300, conversoes:  66, gasto: 1980, receita:  6600 },
  { ano: 2024, mes: 'Janeiro',  campanha: 'Campanha B', impressoes: 195000, cliques: 2145, conversoes:  71, gasto: 1502, receita:  7100 },
  { ano: 2024, mes: 'Janeiro',  campanha: 'Campanha C', impressoes:  72000, cliques: 1584, conversoes:  79, gasto: 1267, receita:  7900 },
  { ano: 2024, mes: 'Fevereiro',campanha: 'Campanha A', impressoes: 235000, cliques: 3760, conversoes:  75, gasto: 2256, receita:  750 },
  { ano: 2024, mes: 'Fevereiro',campanha: 'Campanha B', impressoes: 208000, cliques: 2288, conversoes:  76, gasto: 1602, receita:  7600 },
  { ano: 2024, mes: 'Fevereiro',campanha: 'Campanha C', impressoes:  78000, cliques: 1794, conversoes:  89, gasto: 1435, receita:  890 },
  { ano: 2024, mes: 'Marco',    campanha: 'Campanha A', impressoes: 228000, cliques: 3648, conversoes:  73, gasto: 2189, receita:  7300 },
  { ano: 2024, mes: 'Marco',    campanha: 'Campanha B', impressoes: 215000, cliques: 2365, conversoes:  79, gasto: 1656, receita:  7900 },
  { ano: 2024, mes: 'Marco',    campanha: 'Campanha C', impressoes:  80000, cliques: 1840, conversoes:  92, gasto: 1472, receita:  9200 },
  { ano: 2024, mes: 'Abril',    campanha: 'Campanha A', impressoes: 245000, cliques: 3920, conversoes:  78, gasto: 2352, receita:  7800 },
  { ano: 2024, mes: 'Abril',    campanha: 'Campanha B', impressoes: 222000, cliques: 2664, conversoes:  88, gasto: 1865, receita:  8800 },
  { ano: 2024, mes: 'Abril',    campanha: 'Campanha C', impressoes:  84000, cliques: 1932, conversoes:  96, gasto: 1546, receita:  9600 },
  { ano: 2024, mes: 'Maio',     campanha: 'Campanha A', impressoes: 25000, cliques: 4250, conversoes:  85, gasto: 2550, receita:  8500 },
  { ano: 2024, mes: 'Maio',     campanha: 'Campanha B', impressoes: 230000, cliques: 2760, conversoes:  92, gasto: 1932, receita:  920 },
  { ano: 2024, mes: 'Maio',     campanha: 'Campanha C', impressoes:  86000, cliques: 20600, conversoes: 103, gasto: 1651, receita: 103 },
  { ano: 2024, mes: 'Junho',    campanha: 'Campanha A', impressoes: 240000, cliques: 4080, conversoes:  82, gasto: 2448, receita:  8200 },
  { ano: 2024, mes: 'Junho',    campanha: 'Campanha B', impressoes: 218000, cliques: 26160, conversoes:  87, gasto: 1831, receita:  8700 },
  { ano: 2024, mes: 'Junho',    campanha: 'Campanha C', impressoes:  88000, cliques: 2112, conversoes: 105, gasto: 1690, receita: 1050 },
  { ano: 2024, mes: 'Julho',    campanha: 'Campanha A', impressoes: 23800, cliques: 40461, conversoes:  81, gasto: 2428, receita:  8100 },
  { ano: 2024, mes: 'Julho',    campanha: 'Campanha B', impressoes: 225000, cliques: 2700, conversoes:  90, gasto: 1890, receita:  900 },
  { ano: 2024, mes: 'Julho',    campanha: 'Campanha C', impressoes:  90000, cliques: 2160, conversoes: 108, gasto: 1728, receita: 108 },
  { ano: 2024, mes: 'Agosto',   campanha: 'Campanha A', impressoes: 248000, cliques: 4216, conversoes:  84, gasto: 2530, receita:  8400 },
  { ano: 2024, mes: 'Agosto',   campanha: 'Campanha B', impressoes: 23200, cliques: 2784, conversoes:  93, gasto: 1949, receita:  9300 },
  { ano: 2024, mes: 'Agosto',   campanha: 'Campanha C', impressoes:  92000, cliques: 2208, conversoes: 110, gasto: 1766, receita: 1100 },
  { ano: 2024, mes: 'Setembro', campanha: 'Campanha A', impressoes: 255000, cliques: 4080, conversoes:  100, gasto: 2448, receita:  8200 },
  { ano: 2024, mes: 'Setembro', campanha: 'Campanha B', impressoes: 238000, cliques: 2618, conversoes:  200, gasto: 1833, receita:  8700 },
  { ano: 2024, mes: 'Setembro', campanha: 'Campanha C', impressoes:  95000, cliques: 2375, conversoes: 118, gasto: 1900, receita: 1180 },
  { ano: 2024, mes: 'Outubro',  campanha: 'Campanha A', impressoes: 272000, cliques: 4896, conversoes:  98, gasto: 2938, receita:  9800 },
  { ano: 2024, mes: 'Outubro',  campanha: 'Campanha B', impressoes: 251000, cliques: 2761, conversoes:  92, gasto: 1933, receita:  9200 },
  { ano: 2024, mes: 'Outubro',  campanha: 'Campanha C', impressoes: 102000, cliques: 2550, conversoes: 127, gasto: 2040, receita: 12700 },
  { ano: 2024, mes: 'Novembro', campanha: 'Campanha A', impressoes: 242000, cliques: 4114, conversoes:  82, gasto: 2468, receita:  8200 },
  { ano: 2024, mes: 'Novembro', campanha: 'Campanha B', impressoes: 260000, cliques: 2860, conversoes:  95, gasto: 2002, receita:  950 },
  { ano: 2024, mes: 'Novembro', campanha: 'Campanha C', impressoes: 11800, cliques: 3068, conversoes: 1530, gasto: 2454, receita: 15300 },
  { ano: 2024, mes: 'Dezembro', campanha: 'Campanha A', impressoes: 30600, cliques: 5508, conversoes: 110, gasto: 3305, receita: 110 },
  { ano: 2024, mes: 'Dezembro', campanha: 'Campanha B', impressoes: 28900, cliques: 3468, conversoes: 115, gasto: 2428, receita: 11500 },
  { ano: 2024, mes: 'Dezembro', campanha: 'Campanha C', impressoes: 13500, cliques: 3645, conversoes: 182, gasto: 2916, receita: 18200 },

  // ── 2025 ──────────────────────────────────────────────────────────────────
  { ano: 2025, mes: 'Janeiro',   campanha: 'Campanha A', impressoes: 300000, cliques: 5400, conversoes: 108, gasto: 2700, receita: 100},
  { ano: 2025, mes: 'Janeiro',   campanha: 'Campanha B', impressoes: 28000, cliques: 3360, conversoes: 112, gasto: 2352, receita: 130 },
  { ano: 2025, mes: 'Janeiro',   campanha: 'Campanha C', impressoes: 10800, cliques: 2808, conversoes: 140, gasto: 2246, receita: 14000 },
  { ano: 2025, mes: 'Fevereiro', campanha: 'Campanha A', impressoes: 320000, cliques: 6080, conversoes: 121, gasto: 304, receita: 12100 },
  { ano: 2025, mes: 'Fevereiro', campanha: 'Campanha B', impressoes: 29500, cliques: 3540, conversoes: 118, gasto: 247, receita: 14160 },
  { ano: 2025, mes: 'Fevereiro', campanha: 'Campanha C', impressoes: 115000, cliques: 2990, conversoes: 180, gasto: 200, receita: 14900 },
  { ano: 2025, mes: 'Marco',     campanha: 'Campanha A', impressoes: 285000, cliques: 5415, conversoes: 150, gasto: 20, receita: 10800 },
  { ano: 2025, mes: 'Marco',     campanha: 'Campanha B', impressoes: 305000, cliques: 3660, conversoes: 100, gasto: 25, receita: 1400 },
  { ano: 2025, mes: 'Marco',     campanha: 'Campanha C', impressoes: 12200, cliques: 3172, conversoes: 100, gasto: 20, receita: 158 },
  { ano: 2025, mes: 'Abril',     campanha: 'Campanha A', impressoes: 258000, cliques: 5418, conversoes: 155, gasto: 2979, receita: 15500 },
  { ano: 2025, mes: 'Abril',     campanha: 'Campanha B', impressoes: 240000, cliques: 3840, conversoes: 128, gasto: 1920, receita: 11264 },
  { ano: 2025, mes: 'Abril',     campanha: 'Campanha C', impressoes:  98000, cliques: 2744, conversoes: 137, gasto: 1921, receita: 10963 },
  { ano: 2025, mes: 'Maio',     campanha: 'Campanha A', impressoes: 258000, cliques: 5160, conversoes: 148, gasto: 2838, receita: 14763 },
  { ano: 2025, mes: 'Maio',     campanha: 'Campanha B', impressoes: 243000, cliques: 3888, conversoes: 130, gasto: 1944, receita: 11664 },
  { ano: 2025, mes: 'Maio',     campanha: 'Campanha C', impressoes:  96000, cliques: 2688, conversoes: 134, gasto: 1882, receita: 10720 },
  { ano: 2025, mes: 'Junho',    campanha: 'Campanha A', impressoes: 270000, cliques: 5940, conversoes: 170, gasto: 3267, receita: 17001 },
  { ano: 2025, mes: 'Junho',    campanha: 'Campanha B', impressoes: 252000, cliques: 4284, conversoes: 143, gasto: 2142, receita: 13019 },
  { ano: 2025, mes: 'Junho',    campanha: 'Campanha C', impressoes: 102000, cliques: 3162, conversoes: 158, gasto: 2213, receita: 13035 },
  { ano: 2025, mes: 'Julho',    campanha: 'Campanha A', impressoes: 278000, cliques: 6672, conversoes: 191, gasto: 3670, receita: 19432 },
  { ano: 2025, mes: 'Julho',    campanha: 'Campanha B', impressoes: 260000, cliques: 4940, conversoes: 165, gasto: 2470, receita: 14850 },
  { ano: 2025, mes: 'Julho',    campanha: 'Campanha C', impressoes: 107000, cliques: 3531, conversoes: 176, gasto: 2473, receita: 15136 },
  { ano: 2025, mes: 'Agosto',   campanha: 'Campanha A', impressoes: 262000, cliques: 5240, conversoes: 144, gasto: 2882, receita: 14265 },
  { ano: 2025, mes: 'Agosto',   campanha: 'Campanha B', impressoes: 246000, cliques: 3936, conversoes: 131, gasto: 1968, receita: 11298 },
  { ano: 2025, mes: 'Agosto',   campanha: 'Campanha C', impressoes:  99000, cliques: 2772, conversoes: 138, gasto: 1940, receita: 10626 },
  { ano: 2025, mes: 'Setembro', campanha: 'Campanha A', impressoes: 284000, cliques: 6816, conversoes: 195, gasto: 3749, receita: 19500 },
  { ano: 2025, mes: 'Setembro', campanha: 'Campanha B', impressoes: 265000, cliques: 5035, conversoes: 168, gasto: 2518, receita: 14868 },
  { ano: 2025, mes: 'Setembro', campanha: 'Campanha C', impressoes: 109000, cliques: 3597, conversoes: 180, gasto: 2518, receita: 15120 },
  { ano: 2025, mes: 'Outubro',  campanha: 'Campanha A', impressoes: 298000, cliques: 7748, conversoes: 221, gasto: 4262, receita: 22320 },
  { ano: 2025, mes: 'Outubro',  campanha: 'Campanha B', impressoes: 278000, cliques: 5838, conversoes: 194, gasto: 2919, receita: 17454 },
  { ano: 2025, mes: 'Outubro',  campanha: 'Campanha C', impressoes: 116000, cliques: 4060, conversoes: 203, gasto: 2842, receita: 18067 },
  { ano: 2025, mes: 'Novembro', campanha: 'Campanha A', impressoes: 315000, cliques: 9135, conversoes: 261, gasto: 5023, receita: 26100 },
  { ano: 2025, mes: 'Novembro', campanha: 'Campanha B', impressoes: 295000, cliques: 6785, conversoes: 226, gasto: 3393, receita: 20340 },
  { ano: 2025, mes: 'Novembro', campanha: 'Campanha C', impressoes: 124000, cliques: 4960, conversoes: 248, gasto: 3472, receita: 22320 },
  { ano: 2025, mes: 'Dezembro', campanha: 'Campanha A', impressoes: 332000, cliques: 10624, conversoes: 303, gasto: 5844, receita: 30300 },
  { ano: 2025, mes: 'Dezembro', campanha: 'Campanha B', impressoes: 310000, cliques: 7750,  conversoes: 258, gasto: 3875, receita: 23736 },
  { ano: 2025, mes: 'Dezembro', campanha: 'Campanha C', impressoes: 134000, cliques: 5762,  conversoes: 288, gasto: 4033, receita: 26352 },

  // ── 2026 ──────────────────────────────────────────────────────────────────
  { ano: 2026, mes: 'Janeiro',  campanha: 'Campanha A', impressoes: 285000, cliques: 6270,  conversoes: 179, gasto: 3448, receita: 17543 },
  { ano: 2026, mes: 'Janeiro',  campanha: 'Campanha B', impressoes: 268000, cliques: 5092,  conversoes: 170, gasto: 2546, receita: 15282 },
  { ano: 2026, mes: 'Janeiro',  campanha: 'Campanha C', impressoes: 114000, cliques: 3534,  conversoes: 177, gasto: 2474, receita: 15753 },
  { ano: 2026, mes: 'Fevereiro',campanha: 'Campanha A', impressoes: 292000, cliques: 6716,  conversoes: 192, gasto: 3693, receita: 18816 },
  { ano: 2026, mes: 'Fevereiro',campanha: 'Campanha B', impressoes: 274000, cliques: 5480,  conversoes: 183, gasto: 2740, receita: 16440 },
  { ano: 2026, mes: 'Fevereiro',campanha: 'Campanha C', impressoes: 118000, cliques: 3894,  conversoes: 195, gasto: 2726, receita: 17355 },
  { ano: 2026, mes: 'Marco',    campanha: 'Campanha A', impressoes: 302000, cliques: 7550,  conversoes: 216, gasto: 4152, receita: 21168 },
  { ano: 2026, mes: 'Marco',    campanha: 'Campanha B', impressoes: 282000, cliques: 6204,  conversoes: 207, gasto: 3102, receita: 18423 },
  { ano: 2026, mes: 'Marco',    campanha: 'Campanha C', impressoes: 122000, cliques: 4270,  conversoes: 214, gasto: 2989, receita: 19046 },
]

const ANOS      = [2024, 2025, 2026]
const MESES     = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro','Outubro','Novembro','Dezembro']
const CAMPANHAS = ['Campanha A', 'Campanha B', 'Campanha C']

const METRICAS = [
  { key: 'ctr',  label: 'CTR (%)',  cor: '#3b82f6', unidade: '%',  dica: 'Acima de 1% é considerado bom' },
  { key: 'cpc',  label: 'CPC (R$)', cor: '#f97316', unidade: 'R$', dica: 'Quanto menor, mais eficiente' },
  { key: 'cpa',  label: 'CPA (R$)', cor: '#a855f7', unidade: 'R$', dica: 'Quanto menor, mais rentável' },
  { key: 'roas', label: 'ROAS (x)', cor: '#22c55e', unidade: 'x',  dica: 'Acima de 3x é considerado bom' },
]

const COR_CAMPANHA = {
  'Campanha A': '#3b82f6',
  'Campanha B': '#f97316',
  'Campanha C': '#14b8a6',
}

// ─── Metas e regras de negócio por métrica ───────────────────────────────────
// CTR: meta 2.5% | CPC: meta R$1,50 | CPA: meta R$15,00 | ROAS: meta 3,0x

const META = { ctr: 2.5, cpc: 1.5, cpa: 15.0, roas: 3.0 }

function avaliarMetrica(key, valor) {
  switch (key) {
    case 'ctr':
      if (valor > 2.5)  return 'green'
      if (valor >= 1.5) return 'yellow'
      return 'red'
    case 'cpc':
      if (valor < 1.5) return 'green'
      if (valor > 1.5) return 'red'
      return 'yellow'
    case 'cpa':
      if (valor < 15)  return 'green'
      if (valor <= 16) return 'yellow'
      return 'red'
    case 'roas':
      if (valor > 3) return 'green'
      if (valor < 3) return 'red'
      return 'yellow'
    default: return 'yellow'
  }
}

const COR_STATUS = {
  green:  { bg: '#14532d', border: '#22c55e', text: '#4ade80' },
  yellow: { bg: '#3d3200', border: '#eab308', text: '#facc15' },
  red:    { bg: '#450a0a', border: '#ef4444', text: '#f87171' },
}

const BADGE_STATUS = {
  default: {
    green:  'Acima da meta',
    yellow: 'Na meta',
    red:    'Abaixo da meta',
  },
  cpa: {
    green:  'Gasto baixo',
    yellow: 'Gasto na meta',
    red:    'Gasto alto',
  },
}

// ─── Regras de negócio (fórmulas corretas) ───────────────────────────────────
// CTR  = cliques ÷ impressões × 100
// CPC  = valor gasto ÷ número de cliques
// CPA  = valor gasto ÷ número de conversões
// ROAS = receita gerada ÷ valor investido

function calcMetricas(d) {
  return {
    ...d,
    ctr:  +((d.cliques / d.impressoes) * 100).toFixed(2),
    cpc:  +(d.gasto / d.cliques).toFixed(2),
    cpa:  +(d.gasto / d.conversoes).toFixed(2),
    roas: +(d.receita / d.gasto).toFixed(2),
  }
}

// Soma valores brutos ANTES de calcular métricas (regra correta — nunca média de %)
function agregarESomar(lista) {
  if (lista.length === 0) return null
  const soma = lista.reduce(
    (acc, d) => ({
      impressoes: acc.impressoes + d.impressoes,
      cliques:    acc.cliques    + d.cliques,
      conversoes: acc.conversoes + d.conversoes,
      gasto:      acc.gasto      + d.gasto,
      receita:    acc.receita    + d.receita,
    }),
    { impressoes: 0, cliques: 0, conversoes: 0, gasto: 0, receita: 0 }
  )
  return calcMetricas(soma)
}

// ─── Estilos compartilhados ──────────────────────────────────────────────────

const cardBg = { background: '#1a1d2e', border: '1px solid #2a2d3e', borderRadius: 12 }

const tooltipStyle = {
  contentStyle: { background: '#1a1d2e', border: '1px solid #2a2d3e', borderRadius: 8 },
  labelStyle:   { color: '#94a3b8' },
  itemStyle:    { color: '#e2e8f0' },
}

const selectStyle = {
  background: '#12151f',
  border: '1px solid #2a2d3e',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 14,
  padding: '8px 12px',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 180,
}

// ─── Componentes auxiliares ──────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#cbd5e1', borderLeft: '3px solid #3b82f6', paddingLeft: 12, marginBottom: 16 }}>
      {children}
    </h2>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        {children}
      </select>
    </div>
  )
}

function MetricCard({ metrica, valor, descricao }) {
  const status = avaliarMetrica(metrica.key, valor)
  const c = COR_STATUS[status]
  const valorFormatado = metrica.unidade === 'R$'
    ? `R$ ${valor.toFixed(2)}`
    : metrica.unidade === 'x'
    ? `${valor}x`
    : `${valor}%`

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '20px 24px', flex: '1 1 200px', minWidth: 180 }}>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{metrica.label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, color: c.text }}>{valorFormatado}</p>
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{descricao}</p>
      <span style={{
        display: 'inline-block',
        marginTop: 10,
        padding: '3px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}>
        {(BADGE_STATUS[metrica.key] ?? BADGE_STATUS.default)[status]}
      </span>
    </div>
  )
}

function Vazio({ mensagem }) {
  return (
    <p style={{ color: '#475569', fontSize: 14, padding: '32px 0', textAlign: 'center' }}>
      {mensagem}
    </p>
  )
}

function MetaLabel({ viewBox, valor }) {
  if (!viewBox) return null
  const { x, y } = viewBox
  return (
    <g overflow="visible">
      <rect
        x={x - 78}
        y={y - 11}
        width={74}
        height={22}
        rx={5}
        fill="#3d3200"
        stroke="#eab308"
        strokeWidth={1.5}
      />
      <text
        x={x - 41}
        y={y + 4}
        fill="#facc15"
        fontSize={10}
        fontWeight={700}
        textAnchor="middle"
      >
        Meta: {valor}
      </text>
    </g>
  )
}

// ─── Dashboard principal ─────────────────────────────────────────────────────

export default function Dashboard() {
  const [filtroAno,      setFiltroAno]      = useState('todos')
  const [filtroCampanha, setFiltroCampanha] = useState('todas')
  const [filtroMes,      setFiltroMes]      = useState('todos')
  const [filtroMetrica,  setFiltroMetrica]  = useState('ctr')

  const metricaAtiva       = METRICAS.find(m => m.key === filtroMetrica)
  const campanhasFiltradas = filtroCampanha === 'todas' ? CAMPANHAS : [filtroCampanha]
  const mesesFiltrados     = filtroMes      === 'todos' ? MESES     : [filtroMes]

  // ── dados filtrados por todos os critérios (cards e tabela) ───────────────
  const dadosBrutosFiltrados = useMemo(() => {
    return DADOS_BRUTOS.filter(d => {
      const okAno  = filtroAno      === 'todos' || d.ano      === +filtroAno
      const okCamp = filtroCampanha === 'todas' || d.campanha === filtroCampanha
      const okMes  = filtroMes      === 'todos' || d.mes      === filtroMes
      return okAno && okCamp && okMes
    })
  }, [filtroAno, filtroCampanha, filtroMes])

  // ── dados filtrados apenas por ano e campanha (base para os gráficos) ─────
  // Separado para que o gráfico de linha sempre acesse todos os meses
  const dadosBrutosParaGrafico = useMemo(() => {
    return DADOS_BRUTOS.filter(d => {
      const okAno  = filtroAno      === 'todos' || d.ano      === +filtroAno
      const okCamp = filtroCampanha === 'todas' || d.campanha === filtroCampanha
      return okAno && okCamp
    })
  }, [filtroAno, filtroCampanha])

  // ── cards: agrega somando brutos ANTES de calcular métricas ───────────────
  const totais = useMemo(() => agregarESomar(dadosBrutosFiltrados), [dadosBrutosFiltrados])

  // ── gráfico de linha: pivota por ponto no tempo, uma propriedade por campanha
  // "Todos os anos": exibe cada ano em sequência com label "Mes Ano"
  // Ano específico: exibe apenas os meses daquele ano
  const dadosLinha = useMemo(() => {
    if (filtroAno === 'todos') {
      const mesesToUse = filtroMes === 'todos' ? MESES : [filtroMes]
      const pares = []
      ANOS.forEach(ano => {
        mesesToUse.forEach(mes => {
          const temDados = dadosBrutosParaGrafico.some(d => d.ano === ano && d.mes === mes)
          if (temDados) pares.push({ ano, mes, label: `${mes.slice(0, 3)} ${ano}` })
        })
      })
      return pares.map(({ ano, mes, label }) => {
        const obj = { mes: label }
        campanhasFiltradas.forEach(camp => {
          const entradas = dadosBrutosParaGrafico.filter(d => d.ano === ano && d.mes === mes && d.campanha === camp)
          if (entradas.length > 0) obj[camp] = agregarESomar(entradas)[filtroMetrica]
        })
        return obj
      })
    }
    return mesesFiltrados.map(mes => {
      const obj = { mes }
      campanhasFiltradas.forEach(camp => {
        const entradas = dadosBrutosParaGrafico.filter(d => d.mes === mes && d.campanha === camp)
        if (entradas.length > 0) obj[camp] = agregarESomar(entradas)[filtroMetrica]
      })
      return obj
    })
  }, [filtroAno, filtroMes, mesesFiltrados, campanhasFiltradas, filtroMetrica, dadosBrutosParaGrafico])

  // ── tabela ─────────────────────────────────────────────────────────────────
  const dadosTabela = useMemo(() => dadosBrutosFiltrados.map(calcMetricas), [dadosBrutosFiltrados])

  // ── domínio Y: garante que a linha de meta sempre aparece no gráfico ───────
  const maxValorGrafico = useMemo(() => {
    const valores = dadosLinha.flatMap(d => campanhasFiltradas.map(c => d[c] ?? 0))
    const maxDados = valores.length > 0 ? Math.max(...valores) : 0
    return Math.max(maxDados, META[filtroMetrica]) * 1.2
  }, [dadosLinha, campanhasFiltradas, filtroMetrica])

  // ── label do contexto atual (para títulos) ─────────────────────────────────
  const contexto = [
    filtroAno      !== 'todos' ? filtroAno      : null,
    filtroCampanha !== 'todas' ? filtroCampanha : null,
    filtroMes      !== 'todos' ? filtroMes      : null,
  ].filter(Boolean).join(' — ')

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9' }}>
          Relatorio Mensal de Trafego Pago <br></br> JOTAJÁ - Matheus Magno
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Dados fictícios — Campanhas A, B e C | Set–Dez 2024 e Jan–Abr 2025
        </p>
      </div>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div style={{ ...cardBg, padding: '20px 24px', marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
        <FilterSelect label="Ano" value={filtroAno} onChange={setFiltroAno}>
          <option value="todos">Todos os anos</option>
          {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
        </FilterSelect>

        <FilterSelect label="Mes" value={filtroMes} onChange={setFiltroMes}>
          <option value="todos">Todos os meses</option>
          {MESES.map(m => <option key={m} value={m}>{m}</option>)}
        </FilterSelect>

        <FilterSelect label="Campanha" value={filtroCampanha} onChange={setFiltroCampanha}>
          <option value="todas">Todas as campanhas</option>
          {CAMPANHAS.map(c => <option key={c} value={c}>{c}</option>)}
        </FilterSelect>

      </div>

      {/* ── Cards ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Resumo Geral{contexto && ` — ${contexto}`}</SectionTitle>
        {!totais ? (
          <Vazio mensagem="Nenhum dado para os filtros selecionados." />
        ) : (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <MetricCard
              metrica={METRICAS[0]}
              valor={totais.ctr}
              descricao={`${totais.cliques.toLocaleString('pt-BR')} cliques / ${(totais.impressoes / 1000).toFixed(0)}k impressões`}
            />
            <MetricCard
              metrica={METRICAS[1]}
              valor={totais.cpc}
              descricao={`R$ ${totais.gasto.toLocaleString('pt-BR')} gastos / ${totais.cliques.toLocaleString('pt-BR')} cliques`}
            />
            <MetricCard
              metrica={METRICAS[2]}
              valor={totais.cpa}
              descricao={`${totais.conversoes} conversões no período`}
            />
            <MetricCard
              metrica={METRICAS[3]}
              valor={totais.roas}
              descricao={`R$ ${totais.receita.toLocaleString('pt-BR')} de receita gerada`}
            />
          </div>
        )}
      </div>

      {/* ── Container: filtro de métrica + gráficos + tabela ────────────── */}
      <div style={{ ...cardBg, padding: '24px', marginBottom: 32 }}>

        {/* Filtro de métrica */}
        <div style={{ marginBottom: 28 }}>
          <FilterSelect label="Metrica exibida nos graficos" value={filtroMetrica} onChange={setFiltroMetrica}>
            {METRICAS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </FilterSelect>
        </div>

        <div style={{ borderTop: '1px solid #2a2d3e', paddingTop: 28 }}>

      {/* ── Gráfico de linha ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Evolucao Mensal — {metricaAtiva.label}</SectionTitle>
        <div style={{ ...cardBg, padding: '24px 16px' }}>
          {dadosLinha.length < 2 ? (
            <Vazio mensagem="Selecione 'Todos os meses' para ver a evolução ao longo do tempo." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosLinha} margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                <XAxis
                  dataKey="mes"
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={dadosLinha.length > 8 ? -35 : 0}
                  textAnchor={dadosLinha.length > 8 ? 'end' : 'middle'}
                  height={dadosLinha.length > 8 ? 55 : 30}
                  interval={0}
                />
                <YAxis stroke="#64748b" domain={[0, maxValorGrafico]} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
                <ReferenceLine
                  y={META[filtroMetrica]}
                  stroke="#eab308"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={<MetaLabel valor={META[filtroMetrica]} />}
                />
                {campanhasFiltradas.map(camp => (
                  <Line
                    key={camp}
                    type="monotone"
                    dataKey={camp}
                    stroke={COR_CAMPANHA[camp]}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Gráfico de barras ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Comparativo por Mes — {metricaAtiva.label}</SectionTitle>
        <div style={{ ...cardBg, padding: '24px 16px' }}>
          {dadosLinha.length === 0 ? (
            <Vazio mensagem="Nenhum dado para os filtros selecionados." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosLinha} barCategoryGap="25%" barGap={4} margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                <XAxis
                  dataKey="mes"
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={dadosLinha.length > 8 ? -35 : 0}
                  textAnchor={dadosLinha.length > 8 ? 'end' : 'middle'}
                  height={dadosLinha.length > 8 ? 55 : 30}
                  interval={0}
                />
                <YAxis stroke="#64748b" domain={[0, maxValorGrafico]} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
                <ReferenceLine
                  y={META[filtroMetrica]}
                  stroke="#eab308"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={<MetaLabel valor={META[filtroMetrica]} />}
                />
                {campanhasFiltradas.map(camp => (
                  <Bar key={camp} dataKey={camp} fill={COR_CAMPANHA[camp]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Tabela ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Detalhamento por Ano, Mes e Campanha</SectionTitle>
        {dadosTabela.length === 0 ? (
          <Vazio mensagem="Nenhum dado para os filtros selecionados." />
        ) : (
          <div style={{ ...cardBg, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#12151f' }}>
                  {['Ano', 'Mes', 'Campanha', 'Impressoes', 'Cliques', 'CTR', 'CPC', 'Conversoes', 'CPA', 'ROAS'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', color: '#64748b',
                      fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
                      textTransform: 'uppercase', borderBottom: '1px solid #2a2d3e',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dadosTabela.map((d, i) => (
                  <tr key={`${d.ano}-${d.mes}-${d.campanha}`} style={{ borderBottom: i < dadosTabela.length - 1 ? '1px solid #1e2235' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#94a3b8' }}>{d.ano}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{d.mes}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        background: COR_CAMPANHA[d.campanha] + '22',
                        border: `1px solid ${COR_CAMPANHA[d.campanha]}`,
                        color: COR_CAMPANHA[d.campanha],
                        borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600,
                      }}>
                        {d.campanha}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{d.impressoes.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{d.cliques.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', color: '#60a5fa', fontWeight: 600 }}>{d.ctr}%</td>
                    <td style={{ padding: '12px 16px', color: '#fb923c', fontWeight: 600 }}>R$ {d.cpc.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{d.conversoes}</td>
                    <td style={{ padding: '12px 16px', color: '#c084fc', fontWeight: 600 }}>R$ {d.cpa.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#4ade80', fontWeight: 600 }}>{d.roas}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

        </div>{/* fim borderTop */}
      </div>{/* fim container geral */}

      <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, marginTop: 8 }}>
        Dados fictícios criados para fins de estudo e apresentacao em entrevista.
      </p>

    </div>
  )
}
