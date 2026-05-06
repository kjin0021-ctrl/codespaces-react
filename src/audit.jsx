import { useState } from "react";

const metrics = [
  { val: "100%", label: "数据转化准确率", sub: "Raw → Working Paper" },
  { val: "↓20%", label: "手工处理时间缩短", sub: "流程优化成果" },
  { val: "8", label: "日本上市公司", sub: "覆盖审计主体" },
  { val: "30+", label: "财务报表科目", sub: "全面核查范围" },
];

const flowSteps = [
  { id:"01", label:"数据接收", en:"Ingestion", color:"#B8860B", icon:"▤" },
  { id:"02", label:"清洗标准化", en:"Cleansing", color:"#4A7C8E", icon:"⊞" },
  { id:"03", label:"异常识别", en:"Detection", color:"#7A4E8E", icon:"◎" },
  { id:"04", label:"交叉复核", en:"Verification", color:"#2E7D52", icon:"✓" },
  { id:"05", label:"底稿输出", en:"Delivery", color:"#8E4A2E", icon:"◈" },
];

const excelFuncs = [
  { func: "INDEX MATCH", desc: "双向动态科目映射（更灵活）", code: "=INDEX(科目表!$C:$C,\n  MATCH(A2,科目表!$A:$A,0))" },
  { func: "INDEX MATCH 双维", desc: "行列双向定位关联方余额", code: "=INDEX(数据区,\n  MATCH(科目,科目列,0),\n  MATCH(关联方,关联方行,0))" },
  { func: "VLOOKUP", desc: "科目编码跨表快速映射", code: "=VLOOKUP(A2,\n  科目表!$A:$C,\n  3,0)" },
  { func: "SUMIFS", desc: "多条件分类汇总核算", code: '=SUMIFS(金额列,\n  科目列,A2,\n  期间列,"2024")' },
  { func: "数组公式", desc: "批量波动率异常检测", code: "{=SUM(\n  (ABS(期末-期初)/ABS(期初)>0.3)\n  *(科目列=A2)\n)}" },
];

const sqlQueries = [
  {
    func: "提取培训数据",
    desc: "按部门提取培训参与率与反馈均值",
    code: `SELECT dept,
  COUNT(emp_id) AS participants,
  AVG(satisfaction) AS avg_score,
  SUM(CASE WHEN completed=1
    THEN 1 ELSE 0 END) AS completed
FROM training_records
WHERE year=2024
GROUP BY dept
ORDER BY avg_score DESC;`,
  },
  {
    func: "异常识别",
    desc: "识别满意度低于均值的培训项目",
    code: `SELECT program_name, avg_score
FROM (
  SELECT program_name,
    AVG(satisfaction) AS avg_score
  FROM feedback
  GROUP BY program_name
) t
WHERE avg_score < (
  SELECT AVG(satisfaction) FROM feedback
)
ORDER BY avg_score;`,
  },
  {
    func: "关联分析",
    desc: "培训完成率与绩效评分相关性",
    code: `SELECT
  e.dept,
  AVG(t.completion_rate) AS train_rate,
  AVG(p.performance_score) AS perf_score
FROM employees e
JOIN training t ON e.id = t.emp_id
JOIN performance p ON e.id = p.emp_id
WHERE p.year = 2024
GROUP BY e.dept;`,
  },
];

const tools = [
  { name: "Excel", level: 5 },
  { name: "INDEX MATCH", level: 5 },
  { name: "MySQL / SQL", level: 4 },
  { name: "Python", level: 4 },
  { name: "Tableau", level: 4 },
  { name: "Power BI", level: 4 },
  { name: "Power Pivot", level: 3 },
  { name: "SAP逻辑", level: 3 },
  { name: "Jira", level: 3 },
  { name: "Git", level: 3 },
];

const responsibilities = [
  { icon: "▸", title: "财务数据核算", desc: "负责8家日本上市公司财务数据对账，运用Excel高级建模完成原始数据到审计底稿的全流程处理。" },
  { icon: "▸", title: "异常识别与预警", desc: "基于财务指标趋势分析，识别高风险科目异常波动（如存货跌价+317%、固定资产大额减值），协助团队快速定位风险点。" },
  { icon: "▸", title: "流程标准化优化", desc: "梳理并优化核算逻辑，推动重复性工作标准化，将特定科目手工处理时间缩短约20%。" },
  { icon: "▸", title: "跨团队协作", desc: "在高合规要求场景下参与数据核验与结果复核，培养结构化分析能力和问题定位能力。" },
];

const findings = [
  { label: "存货跌价准备同比", val: "+317%", risk: true },
  { label: "固定资产处置规模", val: "~9.5亿", risk: true },
  { label: "营业收入同比变动", val: "−21%", risk: false },
  { label: "关联采购占营业成本", val: "~78%", risk: false },
];

export default function App() {
  const [activeExcel, setActiveExcel] = useState(0);
  const [tab, setTab] = useState("excel");
  const [activeSql, setActiveSql] = useState(0);

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "28px 20px", fontFamily: "Georgia, serif", color: "#ddd" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#555", marginBottom: "8px" }}>
            DELOITTE CHINA · AUDIT INTERN · DATA PROCESSING & ANALYTICS · 2025.03 – 06
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "400", color: "#fff", margin: "0 0 4px" }}>
            审计数据处理 · 作品集展示
          </h1>
          <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
            花王(中国)投资有限公司 2024年度财务报表审计 · 数据已脱敏处理
          </p>
          <div style={{ height: "1px", background: "linear-gradient(90deg, #B8860B88, transparent)", marginTop: "16px" }} />
        </div>

        {/* ROW 1: METRICS + FLOW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "14px", marginBottom: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {metrics.map((m) => (
              <div key={m.val} style={{ padding: "16px 14px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
                <div style={{ fontSize: "26px", color: "#B8860B", fontWeight: "300", lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: "11px", color: "#ccc", marginTop: "6px", lineHeight: "1.4" }}>{m.label}</div>
                <div style={{ fontSize: "10px", color: "#444", marginTop: "3px" }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 20px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#555", marginBottom: "16px" }}>DATA PROCESSING FLOW</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {flowSteps.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${s.color}`, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: s.color, margin: "0 auto 6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "10px", color: "#bbb", lineHeight: "1.3" }}>{s.label}</div>
                    <div style={{ fontSize: "9px", color: "#444", marginTop: "2px", fontStyle: "italic" }}>{s.en}</div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{ width: "16px", height: "1px", background: `linear-gradient(90deg, ${s.color}88, ${flowSteps[i + 1].color}44)`, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: ROLE + EXCEL/SQL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>

          {/* Role */}
          <div style={{ padding: "18px 20px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#555", marginBottom: "14px" }}>MY ROLE · 角色与职责</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#B8860B22", border: "1px solid #B8860B55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#B8860B", flexShrink: 0 }}>金</div>
              <div>
                <div style={{ fontSize: "13px", color: "#fff" }}>金焜 · Jin Kun</div>
                <div style={{ fontSize: "10px", color: "#666" }}>Audit Intern · Data Processing & Analytics</div>
              </div>
            </div>
            {responsibilities.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <span style={{ color: "#B8860B", fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#ddd", marginBottom: "2px" }}>{r.title}</div>
                  <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.5" }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Excel + SQL */}
          <div style={{ padding: "18px 20px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#555", marginBottom: "12px" }}>TECHNICAL SKILLS · 数据操作展示</div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              {[["excel", "Excel · INDEX MATCH"], ["sql", "SQL · MySQL"]].map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 12px", borderRadius: "4px", border: "none", cursor: "pointer", background: tab === t ? (t === "excel" ? "#2E7D52" : "#4A7C8E") : "#1a1a1a", color: tab === t ? "#fff" : "#666", fontSize: "11px", transition: "all 0.15s" }}>{label}</button>
              ))}
            </div>

            {tab === "excel" && (
              <>
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {excelFuncs.map((f, i) => (
                    <button key={i} onClick={() => setActiveExcel(i)} style={{ padding: "4px 10px", borderRadius: "4px", border: "none", cursor: "pointer", background: activeExcel === i ? "#2E7D52" : "#1a1a1a", color: activeExcel === i ? "#fff" : "#777", fontSize: "11px" }}>{f.func}</button>
                  ))}
                </div>
                <div style={{ padding: "12px", borderRadius: "6px", background: "#0a0a0a", border: "1px solid #222" }}>
                  <div style={{ fontSize: "10px", color: "#2E7D52", marginBottom: "6px" }}>USE CASE · {excelFuncs[activeExcel].desc}</div>
                  <pre style={{ fontFamily: "monospace", fontSize: "12px", color: "#7EC8A0", background: "#0e0e0e", padding: "8px 10px", borderRadius: "4px", border: "1px solid #1e1e1e", margin: "0 0 8px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{excelFuncs[activeExcel].code}</pre>
                </div>
                <div style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "6px", background: "#2E7D5211", borderLeft: "3px solid #2E7D52" }}>
                  <div style={{ fontSize: "11px", color: "#2E7D52", lineHeight: "1.6" }}>实际应用中两者结合使用：VLOOKUP 处理简单单列查找，INDEX MATCH 应对双向查找和列序不固定的复杂场景</div>
                </div>
              </>
            )}

            {tab === "sql" && (
              <>
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {sqlQueries.map((q, i) => (
                    <button key={i} onClick={() => setActiveSql(i)} style={{ padding: "4px 10px", borderRadius: "4px", border: "none", cursor: "pointer", background: activeSql === i ? "#4A7C8E" : "#1a1a1a", color: activeSql === i ? "#fff" : "#777", fontSize: "11px" }}>{q.func}</button>
                  ))}
                </div>
                <div style={{ padding: "12px", borderRadius: "6px", background: "#0a0a0a", border: "1px solid #222" }}>
                  <div style={{ fontSize: "10px", color: "#4A7C8E", marginBottom: "6px" }}>USE CASE · {sqlQueries[activeSql].desc}</div>
                  <pre style={{ fontFamily: "monospace", fontSize: "12px", color: "#7AB8D0", background: "#0e0e0e", padding: "8px 10px", borderRadius: "4px", border: "1px solid #1e1e1e", margin: "0 0 8px", whiteSpace: "pre", lineHeight: "1.7" }}>{sqlQueries[activeSql].code}</pre>
                </div>
                <div style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "6px", background: "#4A7C8E11", borderLeft: "3px solid #4A7C8E" }}>
                  <div style={{ fontSize: "11px", color: "#4A7C8E", lineHeight: "1.6" }}>实际应用：汽车公司实习中用 MySQL 提取培训数据，支撑 Tableau 仪表盘构建</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ROW 3: TOOLS + FINDINGS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "14px" }}>
          <div style={{ padding: "18px 20px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#555", marginBottom: "14px" }}>TOOLS & SKILLS · 工具技能</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tools.map((t) => (
                <div key={t.name} style={{ padding: "5px 12px", borderRadius: "20px", background: t.level >= 5 ? "#B8860B22" : t.level >= 4 ? "#4A7C8E22" : "#2a2a2a", border: `1px solid ${t.level >= 5 ? "#B8860B55" : t.level >= 4 ? "#4A7C8E55" : "#333"}`, fontSize: "11px", color: t.level >= 5 ? "#B8860B" : t.level >= 4 ? "#5AA0C0" : "#666" }}>
                  {t.name}
                  {t.level >= 5 && <span style={{ marginLeft: "5px", fontSize: "9px" }}>★★</span>}
                  {t.level === 4 && <span style={{ marginLeft: "5px", fontSize: "9px" }}>★</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
              {[["#B8860B", "★★ 核心技能"], ["#4A7C8E", "★ 熟练使用"], ["#444", "常用工具"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
                  <span style={{ fontSize: "9px", color: "#555" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "18px 20px", borderRadius: "8px", border: "1px solid #1e1e1e", background: "#111" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#555", marginBottom: "14px" }}>KEY FINDINGS · 关键异常发现（模拟数据）</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {findings.map((f) => (
                <div key={f.label} style={{ padding: "10px 12px", borderRadius: "6px", border: `1px solid ${f.risk ? "#8E4A2E44" : "#4A7C8E44"}`, background: f.risk ? "#8E4A2E0e" : "#4A7C8E0e" }}>
                  <div style={{ fontSize: "10px", color: "#666", marginBottom: "5px" }}>{f.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: "300", color: f.risk ? "#E07050" : "#5AA0C0" }}>{f.val}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "6px", background: "#2E7D5211", borderLeft: "3px solid #2E7D52" }}>
              <div style={{ fontSize: "11px", color: "#2E7D52", lineHeight: "1.6" }}>✓ 通过异常识别，协助团队在现场审计中快速锁定高风险科目，提升排查效率</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", fontSize: "9px", color: "#2a2a2a", textAlign: "center", letterSpacing: "0.1em" }}>
          * 本展示基于真实审计项目结构，所有具体财务数字已替换为模拟数据 · For portfolio use only · Jin Kun 2025
        </div>
      </div>
    </div>
  );
}