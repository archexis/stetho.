import React, { useState, useEffect } from 'react';
import { AlemService } from './services/AlemService';const dict = {
  en: {
    reactors: "Reactors", alerts: "Alerts", reports: "Reports",
    title: "stetho.", subtitle: "Diagnostic Terminal",
    activeSensors: "Active Sensors",
    temp: "Temp", ph: "pH Level", runtime: "Uptime", vibro: "Vibration",
    normal: "Nominal", critical: "Deviated",
    allClear: "All Clear", sensorsNominal: "Sensors reading nominal",
    alertDetected: "Alert Detected", evt: "EVT-0982",
    cavitation: "Cavitation Risk", estFail: "Est. Failure Time", conf: "AI Confidence",
    rawSignal: "Raw Signal Data", freqBand: "Freq. Band", midRange: "Mid-Range",
    varDev: "Var. Deviation", vibInst: "Vibration Instability", rising: "Rising",
    engLog: "Diagnostic Log",
    log1: "Sys log: Abnormal vibration pattern.",
    log2: "Match: Early-stage cavitation signature.",
    log3: "Action: Physical inspection of impeller assembly required.",
    sysAlerts: "System Alerts", 
    exportLogs: "Diagnostic Reports",
    date: "Date", timeTbl: "Time", titleTbl: "Title", statusTbl: "Status", dl: "Download",
    darkMode: "Dark Mode", lightMode: "Light Mode",
    operatorAction: "Operator Action Required",
    btnVerify: "Acknowledge Alert",
    btnFalsePositive: "False Positive",
    anomalyDuration: "Anomaly Duration",
    reconErr: "Reconstruction Error", aeTitle: "Autoencoder RMSE", threshold: "Threshold", timeX: "Time (t)"
  },
  ru: {
    reactors: "Реакторы", alerts: "Оповещения", reports: "Отчеты",
    title: "stetho.", subtitle: "Диагностический терминал",
    activeSensors: "Датчиков в сети",
    temp: "Температура", ph: "Уровень pH", runtime: "Время работы", vibro: "Вибрация",
    normal: "В норме", critical: "Отклонение",
    allClear: "Показатели в норме", sensorsNominal: "Аномалий не обнаружено",
    alertDetected: "Обнаружена угроза", evt: "СБТ-0982",
    cavitation: "Риск кавитации", estFail: "Ожид. время отказа", conf: "Достоверность ИИ",
    rawSignal: "Анализ сигнала", freqBand: "Диапазон частот", midRange: "Средние",
    varDev: "Степень отклонения", vibInst: "Нестабильность", rising: "Возрастает",
    engLog: "Журнал диагностики",
    log1: "Сист. лог: Аберрация вибрационного паттерна.",
    log2: "Совпадение: Сигнатура кавитации на ранней стадии.",
    log3: "Действие: Требуется физический осмотр крыльчатки.",
    sysAlerts: "Системные оповещения",
    exportLogs: "Журналы нейросети",
    date: "Дата", timeTbl: "Время", titleTbl: "Название", statusTbl: "Статус валидации", dl: "Скачать",
    darkMode: "Темная тема", lightMode: "Светлая тема",
    operatorAction: "Требуется решение оператора",
    btnVerify: "Квитировать (Принять)",
    btnFalsePositive: "Ложное срабатывание",
    anomalyDuration: "Длительность аномалии",
    reconErr: "Ошибка реконструкции", aeTitle: "RMSE автоэнкодера", threshold: "Порог отсечки", timeX: "Время (t)"
  },
  kk: {
    reactors: "Реакторлар", alerts: "Ескертулер", reports: "Есептер",
    title: "stetho.", subtitle: "Диагностикалық терминал",
    activeSensors: "Желідегі датчиктер",
    temp: "Температура", ph: "pH деңгейі", runtime: "Жұмыс уақыты", vibro: "Діріл",
    normal: "Қалыпты", critical: "Ауытқу",
    allClear: "Көрсеткіштер қалыпты", sensorsNominal: "Аномалиялар табылған жоқ",
    alertDetected: "Қауіп анықталды", evt: "ОҚҒ-0982",
    cavitation: "Кавитация қаупі", estFail: "Істен шығу уақыты", conf: "АИ ықтималдылығы",
    rawSignal: "Сигнал анализі", freqBand: "Жиілік диапазоны", midRange: "Орташа",
    varDev: "Ауытқу деңгейі", vibInst: "Тұрақсыздық", rising: "Өсуде",
    engLog: "Диагностика журналы",
    log1: "Жүйе: Діріл паттернінің ауытқуы.",
    log2: "Сәйкестік: Ерте кавитация сигнатурасы.",
    log3: "Әрекет: Қалақшаны физикалық тексеру қажет.",
    sysAlerts: "Жүйелік ескертулер",
    exportLogs: "Нейрожелі журналдары",
    date: "Күні", timeTbl: "Уақыт", titleTbl: "Атауы", statusTbl: "Тексеру статусы", dl: "Жүктеу",
    darkMode: "Қараңғы тақырып", lightMode: "Жарық тақырып",
    operatorAction: "Оператор шешімі қажет",
    btnVerify: "Қабылдау (Квитация)",
    btnFalsePositive: "Жалған дабыл",
    anomalyDuration: "Аномалия ұзақтығы",
    reconErr: "Реконструкция қателігі", aeTitle: "Автоэнкодер RMSE", threshold: "Шек", timeX: "Уақыт (t)"
  }
};

const reactorsData = [
  { id: 1, name: "BIO_R01", status: "normal", temperature: "36.5°C", ph: "7.1", runtime: "18h" },
  { id: 2, name: "BIO_R02", status: "critical", temperature: "37.2°C", ph: "6.8", runtime: "42h" },
  { id: 3, name: "BIO_R03", status: "normal", temperature: "36.6°C", ph: "7.2", runtime: "05h" }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('reactors');
  const [selectedReactorId, setSelectedReactorId] = useState(null);
  const [isDark, setIsDark] = useState(false);
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (selectedReactorId) {
      const r = reactorsData.find(x => x.id === selectedReactorId);
      if (r) {
        setIsAnalyzing(true);
        setAiAnalysis(null);
        AlemService.getDiagnostics(r.id, r.temperature, r.ph, r.status).then(res => {
          setAiAnalysis(res);
          setIsAnalyzing(false);
        });
      }
    }
  }, [selectedReactorId]);
  
  const d = dict[lang];
  const selectedReactor = reactorsData.find(r => r.id === selectedReactorId);

  return (
    <div className="flex h-screen w-full bg-stetho-bg dark:bg-stetho-darkBg text-stetho-text dark:text-stetho-darkText tracking-normal text-[15px] transition-colors duration-300">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-stetho-sidebar dark:bg-stetho-darkSidebar border-r border-stetho-border dark:border-stetho-darkBorder flex flex-col pt-8 transition-colors duration-300">
        <div className="px-8 pb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-stetho-text dark:text-stetho-darkText">{d.title}</h1>
          <p className="text-[13px] text-stetho-textMuted dark:text-stetho-darkTextMuted mt-1">{d.subtitle}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {['reactors', 'alerts', 'reports'].map(tabKey => (
            <button
              key={tabKey}
              onClick={() => { setActiveTab(tabKey); setSelectedReactorId(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] transition-colors ${
                activeTab === tabKey 
                  ? 'bg-stetho-bg dark:bg-stetho-darkBg border border-stetho-border dark:border-stetho-darkBorder shadow-sm font-medium text-stetho-text dark:text-stetho-darkText' 
                  : 'text-stetho-textMuted dark:text-stetho-darkTextMuted hover:text-stetho-text dark:hover:text-stetho-darkText hover:bg-stetho-hover dark:hover:bg-stetho-darkHover border border-transparent'
              }`}
            >
              {d[tabKey]}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-stetho-border dark:border-stetho-darkBorder text-center transition-colors duration-300">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="text-[12px] text-stetho-text dark:text-stetho-darkText hover:bg-stetho-hover dark:hover:bg-stetho-darkHover px-3 py-1.5 rounded-md border border-stetho-border dark:border-stetho-darkBorder mb-4 transition-colors w-full"
          >
            {isDark ? d.lightMode : d.darkMode}
          </button>
          
          <div className="flex gap-2 justify-center text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted uppercase font-medium tracking-wide">
            <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-stetho-text dark:text-stetho-darkText' : 'hover:text-stetho-text dark:hover:text-stetho-darkText'}>EN</button>
            <span>&middot;</span>
            <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-stetho-text dark:text-stetho-darkText' : 'hover:text-stetho-text dark:hover:text-stetho-darkText'}>RU</button>
            <span>&middot;</span>
            <button onClick={() => setLang('kk')} className={lang === 'kk' ? 'text-stetho-text dark:text-stetho-darkText' : 'hover:text-stetho-text dark:hover:text-stetho-darkText'}>KK</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {activeTab === 'reactors' && (
          <div className="p-16 max-w-5xl">
            <header className="mb-12 flex items-baseline justify-between">
              <h2 className="text-3xl font-medium tracking-tight text-stetho-text dark:text-stetho-darkText">{d.reactors}</h2>
              <span className="text-sm text-stetho-textMuted dark:text-stetho-darkTextMuted">{d.activeSensors}: <strong className="text-stetho-text dark:text-stetho-darkText font-medium">{reactorsData.length}</strong></span>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reactorsData.map(r => {
                const isCritical = r.status === 'critical';
                return (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedReactorId(r.id)}
                    className={`p-6 rounded-2xl border-[1.5px] cursor-pointer transition-all bg-stetho-bg dark:bg-stetho-darkBg ${
                      selectedReactorId === r.id 
                        ? 'border-stetho-text dark:border-stetho-darkText shadow-sm' 
                        : 'border-stetho-border dark:border-stetho-darkBorder hover:border-stetho-borderHover dark:hover:border-stetho-darkBorderHover'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="text-[17px] font-medium text-stetho-text dark:text-stetho-darkText">{r.name}</h3>
                      <div className="flex items-center gap-1.5 bg-stetho-sidebar dark:bg-stetho-darkSidebar px-2.5 py-1 rounded-full border border-stetho-border dark:border-stetho-darkBorder">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-status-critical dark:bg-status-darkCritical animate-pulse' : 'bg-status-normal dark:bg-status-darkNormal'}`}></div>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-stetho-text dark:text-stetho-darkText">
                           {isCritical ? d.critical : d.normal}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-5">
                      <div>
                        <div className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted mb-0.5">{d.temp}</div>
                        <div className="text-[14px] font-medium text-stetho-text dark:text-stetho-darkText">{r.temperature}</div>
                      </div>
                      <div>
                        <div className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted mb-0.5">{d.ph}</div>
                        <div className="text-[14px] font-medium text-stetho-text dark:text-stetho-darkText">{r.ph}</div>
                      </div>
                      <div>
                        <div className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted mb-0.5">{d.runtime}</div>
                        <div className="text-[14px] font-medium text-stetho-text dark:text-stetho-darkText">{r.runtime}</div>
                      </div>
                      <div>
                        <div className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted mb-0.5">{d.vibro}</div>
                        <div className={`text-[14px] font-medium ${isCritical ? 'text-status-critical dark:text-status-darkCritical' : 'text-stetho-text dark:text-stetho-darkText'}`}>
                          {isCritical ? d.critical : d.normal}
                        </div>
                      </div>
                    </div>
                  </div>
              )})}
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="p-16 max-w-4xl">
            <h2 className="text-3xl font-medium tracking-tight mb-10 text-stetho-text dark:text-stetho-darkText">{d.sysAlerts}</h2>
            <div className="space-y-3">
              {[
                { time: "19:42", src: "BIO_R02", lvl: 'critical', msg: d.log1, dur: "01h 45m" },
                { time: "18:15", src: "BIO_R01", lvl: 'warning', msg: (lang === 'en' ? "pH deviation threshold reached" : lang === 'ru' ? "Превышен порог отключения pH" : "pH ауытқу шегіне жетті"), dur: "12m" },
                { time: "09:00", src: "SYSTEM", lvl: 'normal', msg: (lang === 'en' ? "Routine sensor calibration completed" : lang === 'ru' ? "Рутинная калибровка завершена" : "Датчиктерді калибрлеу аяқталды"), dur: "-" }
              ].map((a, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border-[1.5px] border-stetho-border dark:border-stetho-darkBorder bg-stetho-bg dark:bg-stetho-darkBg hover:border-stetho-borderHover dark:hover:border-stetho-darkBorderHover transition-colors flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className="text-[13px] text-stetho-textMuted dark:text-stetho-darkTextMuted font-mono bg-stetho-sidebar dark:bg-stetho-darkSidebar px-2 py-1 rounded-md">{a.time}</span>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      a.lvl === 'critical' ? 'bg-status-critical dark:bg-status-darkCritical shadow-[0_0_8px_rgba(255,59,48,0.5)]' : a.lvl === 'warning' ? 'bg-status-warning dark:bg-status-darkWarning' : 'bg-status-normal dark:bg-status-darkNormal'
                    }`}></div>
                    <span className="text-[13px] font-medium min-w-[70px] text-stetho-text dark:text-stetho-darkText">{a.src}</span>
                  </div>
                  <div className="text-[14px] text-stetho-text dark:text-stetho-darkText w-full sm:flex-1 flex items-center sm:px-4 sm:border-x border-stetho-border dark:border-stetho-darkBorder">
                    {a.msg}
                  </div>
                  <div className="flex items-center text-[12px] font-mono text-stetho-textMuted dark:text-stetho-darkTextMuted w-16 justify-end">
                    {a.dur}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="p-16 max-w-5xl">
            <h2 className="text-3xl font-medium tracking-tight mb-10 text-stetho-text dark:text-stetho-darkText">{d.exportLogs}</h2>
            <div className="bg-stetho-bg dark:bg-stetho-darkBg border border-stetho-border dark:border-stetho-darkBorder rounded-2xl overflow-hidden">
              <table className="w-full text-left text-[14px] border-collapse">
                <thead className="bg-stetho-sidebar dark:bg-stetho-darkSidebar border-b border-stetho-border dark:border-stetho-darkBorder text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted uppercase tracking-wide font-medium">
                  <tr>
                    <th className="font-normal p-4 pl-6 w-[20%]">{d.date}</th>
                    <th className="font-normal p-4 w-[40%]">{d.titleTbl}</th>
                    <th className="font-normal p-4 w-[40%] text-right pr-6">{d.statusTbl}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stetho-border dark:divide-stetho-darkBorder">
                  {[
                    { d: "09.04.2026", t: "09_04_2026_BIO_R02_ANOMALY.pdf", s: "unverified", sTxt: lang === 'en' ? "Needs Review" : lang === 'ru' ? "Ожидает ревью" : "Қарауды қажет етеді" },
                    { d: "08.04.2026", t: "08_04_2026_BIO_R01_FALSE_POS.log", s: "dismissed", sTxt: lang === 'en' ? "False Positive" : lang === 'ru' ? "Ложное срабатывание" : "Жалған дабыл" },
                    { d: "01.04.2026", t: "01_04_SYSTEM_CALIBRATION.dat", s: "verified", sTxt: lang === 'en' ? "Verified / Normal" : lang === 'ru' ? "Проверено / Норма" : "Тексерілген / Қалыпты" }
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-stetho-sidebar dark:hover:bg-stetho-darkSidebar cursor-pointer group transition-colors">
                      <td className="p-4 pl-6 text-stetho-textMuted dark:text-stetho-darkTextMuted font-mono text-[13px]">{r.d}</td>
                      <td className="p-4 font-medium text-stetho-text dark:text-stetho-darkText text-[13px]">{r.t}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`px-2.5 py-1 rounded text-[12px] font-medium border ${
                          r.s === 'unverified' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                          r.s === 'dismissed' ? 'bg-stetho-hover dark:bg-stetho-darkHover text-stetho-textMuted dark:text-stetho-darkTextMuted border-stetho-border dark:border-stetho-darkBorder line-through opacity-70' :
                          'bg-status-normal/10 text-status-normal border-status-normal/20'
                        }`}>
                          {r.sTxt}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* DETAILS SIDE-PANEL */}
      {activeTab === 'reactors' && selectedReactor && (
        <div className="w-[420px] border-l border-stetho-border dark:border-stetho-darkBorder bg-stetho-sidebar/95 dark:bg-stetho-darkSidebar/95 absolute right-0 top-0 bottom-0 shadow-2xl overflow-y-auto backdrop-blur-md z-20 transition-all duration-300 transform translate-x-0">
            <div className="p-8 sticky top-0 flex justify-between items-center pb-6 bg-stetho-sidebar dark:bg-stetho-darkSidebar border-b border-transparent">
              <h2 className="text-2xl font-medium tracking-tight text-stetho-text dark:text-stetho-darkText">{selectedReactor.name}</h2>
              <button 
                onClick={() => setSelectedReactorId(null)} 
                className="w-8 h-8 rounded-full bg-stetho-bg dark:bg-stetho-darkBg border border-stetho-border dark:border-stetho-darkBorder flex items-center justify-center hover:bg-stetho-hover dark:hover:bg-stetho-darkHover text-stetho-textMuted dark:text-stetho-darkTextMuted hover:text-stetho-text dark:hover:text-stetho-darkText transition-colors text-lg leading-none pb-0.5"
              >
                &times;
              </button>
            </div>
            
            <div className="p-8 pt-6">
              {selectedReactor.status === 'critical' ? (
                <>
                  {/* ANOMALY DURATION BLOCK */}
                  <div className="mb-6 bg-stetho-bg dark:bg-stetho-darkBg p-4 rounded-xl border border-stetho-border dark:border-stetho-darkBorder flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-status-critical dark:bg-status-darkCritical animate-pulse shadow-[0_0_8px_rgba(255,59,48,0.5)]"></div>
                      <div className="text-[13px] font-medium text-stetho-text dark:text-stetho-darkText">{d.anomalyDuration}</div>
                    </div>
                    <div className="text-[13px] font-medium text-status-critical dark:text-status-darkCritical font-mono bg-stetho-criticalLight dark:bg-stetho-darkCriticalLight border border-stetho-criticalBorder dark:border-stetho-darkCriticalBorder px-2.5 py-1 rounded-md">
                      01h 45m
                    </div>
                  </div>

                  <div className="bg-stetho-criticalLight dark:bg-stetho-darkCriticalLight p-5 rounded-2xl mb-8 border border-stetho-criticalBorder dark:border-stetho-darkCriticalBorder">
                    <h4 className="text-status-critical dark:text-status-darkCritical font-medium text-[13px] uppercase tracking-wide flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-status-critical dark:bg-status-darkCritical animate-pulse shadow-[0_0_8px_rgba(255,59,48,0.5)]"></span>
                      {d.cavitation}
                    </h4>
                    <div className="space-y-2 text-[14px] text-status-critical dark:text-status-darkCritical opacity-90">
                      <div className="flex justify-between">
                        <span>{d.estFail}</span>
                        <span className="font-medium text-status-critical dark:text-status-darkCritical">
                          {isAnalyzing ? '...' : (aiAnalysis?.metrics?.estFailure || '12.4h')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{d.conf}</span>
                        <span className="font-medium text-status-critical dark:text-status-darkCritical">
                           {isAnalyzing ? '...' : (aiAnalysis?.metrics?.confidence || '82.1%')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                      <h4 className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted uppercase tracking-wide font-medium border-b border-stetho-border dark:border-stetho-darkBorder pb-2 mb-4">{d.rawSignal}</h4>
                      <div className="space-y-4 text-[14px]">
                        <div className="flex justify-between">
                            <span className="text-stetho-textMuted dark:text-stetho-darkTextMuted">{d.freqBand}</span>
                            <span className="font-medium bg-stetho-bg dark:bg-stetho-darkBg px-2 py-0.5 rounded border border-stetho-border dark:border-stetho-darkBorder text-[13px] text-stetho-text dark:text-stetho-darkText">
                               {isAnalyzing ? '...' : (aiAnalysis?.metrics?.freqBand || d.midRange)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stetho-textMuted dark:text-stetho-darkTextMuted">{d.varDev}</span>
                            <span className="font-medium text-status-critical dark:text-status-darkCritical bg-stetho-criticalLight dark:bg-stetho-darkCriticalLight border border-transparent px-2 py-0.5 rounded text-[13px]">
                               {isAnalyzing ? '...' : (aiAnalysis?.metrics?.varDev || '+18.4%')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stetho-textMuted dark:text-stetho-darkTextMuted">{d.vibInst}</span>
                            <span className="font-medium text-stetho-text dark:text-stetho-darkText">
                              {isAnalyzing ? '...' : (aiAnalysis?.metrics?.trend || d.rising)}
                            </span>
                        </div>
                      </div>
                  </div>

                  {/* AUTOENCODER GRAPH BLOCK */}
                  <div className="mb-8">
                      <h4 className="text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted uppercase tracking-wide font-medium border-b border-stetho-border dark:border-stetho-darkBorder pb-2 mb-4">{d.aeTitle}</h4>
                      <div className="p-4 bg-stetho-bg dark:bg-stetho-darkBg border border-stetho-border dark:border-stetho-darkBorder rounded-xl relative shadow-sm">
                        <div className="flex justify-between items-end mb-3 text-[11px] text-stetho-textMuted dark:text-stetho-darkTextMuted font-medium">
                          <span>{d.reconErr}</span>
                          <span className="flex items-center gap-1.5"><span className="w-3 border-t-2 border-dashed border-status-warning dark:border-status-darkWarning/80 block"></span> {d.threshold}</span>
                        </div>
                        <div className="w-full h-28 relative overflow-hidden mt-1 text-stetho-textMuted dark:text-stetho-darkTextMuted/20 border-b border-l border-stetho-border dark:border-stetho-darkBorder">
                           {/* X/Y GRIDS */}
                           <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:25px_25px] opacity-10"></div>
                           
                           {/* DOTTED THRESHOLD LINE */}
                           <div className="absolute top-[40%] w-full border-t-[1.5px] border-dashed border-status-warning dark:border-status-darkWarning/70 filter drop-shadow-[0_0_2px_rgba(255,149,0,0.5)] z-10"></div>
                           
                           {/* SVG GRAPH */}
                           <svg viewBox="0 0 100 40" className="absolute top-0 left-0 w-full h-full pb-[1px] pl-[1px] overflow-visible" preserveAspectRatio="none">
                              {/* Baseline noise and spike */}
                              <polyline 
                                points="0,32 5,30 10,34 15,31 20,33 25,32 30,35 35,31 40,33 45,30 50,32 55,34 60,31 65,33 70,36 75,32 
                                        80,18 85,8 90,14 95,5 100,2" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="0.8"
                                className="text-status-critical dark:text-status-darkCritical drop-shadow-[0_0_3px_rgba(255,59,48,0.6)]"
                                strokeLinejoin="round"
                              />
                              
                              {/* Fill area under curve */}
                              <polygon 
                                points="0,40 0,32 5,30 10,34 15,31 20,33 25,32 30,35 35,31 40,33 45,30 50,32 55,34 60,31 65,33 70,36 75,32 
                                        80,18 85,8 90,14 95,5 100,2 100,40"
                                className="fill-status-critical/10 dark:fill-status-darkCritical/10"
                              />
                           </svg>
                        </div>
                        <div className="flex justify-between items-center mt-2 w-full text-[10px] text-stetho-textMuted/80 dark:text-stetho-darkTextMuted/80 uppercase tracking-widest font-mono">
                          <span>t-15m</span>
                          <span>{d.timeX}</span>
                          <span className="text-status-critical dark:text-status-darkCritical/90 font-bold">t=0</span>
                        </div>
                      </div>
                  </div>

                  <div>
                      <h4 className="flex items-center text-[12px] text-stetho-textMuted dark:text-stetho-darkTextMuted uppercase tracking-wide font-medium border-b border-stetho-border dark:border-stetho-darkBorder pb-2 mb-4">
                        {d.engLog}
                        {isAnalyzing && <span className="ml-2 w-3 h-3 border-2 border-stetho-textMuted border-t-transparent rounded-full animate-spin"></span>}
                      </h4>
                      <div className="p-4 bg-stetho-bg dark:bg-stetho-darkBg border border-stetho-border dark:border-stetho-darkBorder rounded-xl text-[14px] text-stetho-text dark:text-stetho-darkText leading-relaxed">
                        {isAnalyzing ? (
                          <span className="text-stetho-textMuted dark:text-stetho-darkTextMuted animate-pulse">Running AlemLLM diagnostics...</span>
                        ) : (
                          <>
                            {aiAnalysis?.llm_report?.log1 || d.log1}<br/><br/>
                            {aiAnalysis?.llm_report?.log2 || d.log2}<br/>
                            <span className="inline-block mt-2 font-medium border-l-[3px] border-status-warning dark:border-status-darkWarning pl-2">
                              {aiAnalysis?.llm_report?.log3 || d.log3}
                            </span>
                          </>
                        )}
                      </div>
                  </div>
                </>
              ) : (
                <div className="text-center pt-20 text-stetho-textMuted dark:text-stetho-darkTextMuted">
                    <div className="text-status-normal dark:text-status-darkNormal text-4xl mb-3">&check;</div>
                    <div className="text-[15px] font-medium text-stetho-text dark:text-stetho-darkText mb-1">{d.allClear}</div>
                    <div className="text-[13px]">{d.sensorsNominal}</div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}
