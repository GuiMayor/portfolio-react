import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Cpu, 
  Search, 
  Briefcase, 
  Code2, 
  Terminal,
  Layers,
  Send,
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';

const apiKey = ""; // La plataforma proporciona la clave automáticamente

// Estilos globales
const ExecutiveStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap');
    :root {
      --navy: #0A192F;
      --emerald: #10B981;
      --slate: #64748B;
    }
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
    html { scroll-behavior: smooth; }
    .gemini-gradient {
      background: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `}} />
);

const App = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [jdText, setJdText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State para el chat de IA
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hola, soy el asistente virtual de Edward. Puedo contarte sobre su experiencia técnica o su liderazgo en la Armada. ¿Qué te gustaría saber?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const experience = [
    {
      id: 1,
      role: "Programador Full Stack",
      company: "Upgrade Hub (Málaga)",
      period: "07/2025 - 09/2025",
      category: "Desarrollo Full Stack",
      metrics: "Proyecto Final: Web de Eventos Escalable",
      desc: "Desarrollo integral de plataforma web utilizando Angular en el frontend y Python con MySQL en el backend. Implementación de control de versiones con Git/GitHub."
    },
    {
      id: 2,
      role: "Jefe del Departamento de Misiles",
      company: "Fuerza Armada Nacional Bolivariana",
      period: "08/2022 - 03/2023",
      category: "Liderazgo de Equipos",
      metrics: "Liderazgo de 70+ personas",
      desc: "Gestión de proyectos críticos de alta responsabilidad. Aplicación de metodologías de planificación y control estratégico."
    },
    {
      id: 3,
      role: "Controlador de Tránsito Aéreo",
      company: "Inst. Univ. de Aeronáutica Civil",
      period: "2011 - 2012",
      category: "Gestión Administrativa",
      metrics: "Precisión y toma de decisiones crítica",
      desc: "Gestión de operaciones de alta complejidad bajo presión y resolución de problemas en tiempo real."
    }
  ];

  const skills = [
    { name: "Full Stack (Angular/React)", level: 85, icon: <Layers size={18} /> },
    { name: "Backend (Python/MySQL)", level: 88, icon: <Terminal size={18} /> },
    { name: "Liderazgo de Equipos", level: 95, icon: <Users size={18} /> },
    { name: "Arquitectura y GitHub", level: 90, icon: <Code2 size={18} /> },
    { name: "Resolución de Problemas", level: 94, icon: <ShieldCheck size={18} /> },
    { name: "Gestión de Proyectos", level: 92, icon: <Briefcase size={18} /> }
  ];

  // Función para llamar a Gemini API con reintentos
  const callGemini = async (prompt, systemPrompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('No se pudo conectar con la IA después de varios intentos.');
  };

  const handleAiAnalysis = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);

    const systemPrompt = `Eres un experto Reclutador IT y CFO. Analizas el CV de Edward Villalobos y lo comparas con una Job Description.
    Edward: Full Stack (Angular, Python, MySQL), Ex-Jefe de Misiles (Liderazgo 70+ personas), Controlador Aéreo.
    Devuelve un JSON estrictamente con este formato: 
    { "score": numero_0_a_100, "conclusion": "texto breve", "pros": ["punto1", "punto2"], "veredicto": "texto corto" }`;

    try {
      const result = await callGemini(`Analiza este puesto: ${jdText}`, systemPrompt);
      // Limpiar el resultado por si viene con markdown
      const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
      setAiAnalysis(JSON.parse(jsonStr));
    } catch (err) {
      console.error(err);
      setAiAnalysis({ score: 0, error: true });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const systemPrompt = `Eres el asistente virtual de Edward Guillermo Villalobos. Responde de forma profesional, concisa y persuasiva. 
    Datos clave: Vive en Málaga, Programador Full Stack (Upgrade Hub), experto en Python, Angular, MySQL. 
    Pasado: Jefe de Misiles en la Armada (liderazgo estratégico). 
    Objetivo: Convencer al reclutador de que su perfil híbrido (técnico + liderazgo) es único.`;

    try {
      const response = await callGemini(userMsg, systemPrompt);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Lo siento, tuve un problema de conexión. Pero Edward es excelente, ¡te lo aseguro!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredExp = useMemo(() => 
    activeTab === 'All' ? experience : experience.filter(e => e.category === activeTab)
  , [activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A192F]">
      <ExecutiveStyles />
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-xl tracking-tight uppercase">EG <span className="text-emerald-600">FullStack</span></span>
          <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <a href="#inicio" className="hover:text-navy transition-colors">Perfil</a>
            <a href="#kpi" className="hover:text-navy transition-colors">Dashboard</a>
            <a href="#ia" className="bg-navy text-white px-3 py-1 rounded flex items-center gap-2">
              <Sparkles size={12} /> Gemini Insight
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="inicio" className="pt-32 pb-20 px-6 bg-navy text-white relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold mb-6 border border-emerald-500/30">
              <ShieldCheck size={14} /> FULL STACK STRATEGIST
            </div>
            <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-tight text-[#0A192F]">
              Edward <br /> Villalobos
            </h1>
            <p className="text-emerald-400 text-xl font-medium mb-8">
              Liderazgo Militar aplicado al Software Moderno
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#ia" className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded text-white font-bold transition-all flex items-center gap-2">
                <Sparkles size={18} /> ✨ Probar Analista IA
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
             {/* Chat Flotante en Hero */}
             <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[400px]">
                <div className="bg-navy p-4 text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Edward AI Chat ✨</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-navy text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && <div className="text-[10px] text-slate-400 italic">Gemini está redactando...</div>}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChat} className="p-2 border-t border-slate-100 flex gap-2">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta sobre Edward..." 
                    className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-xs text-[#0A192F] focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button type="submit" className="p-2 bg-navy text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <Send size={14} />
                  </button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD SKILLS */}
      <section id="kpi" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl mb-12 text-center">Dashboard de Competencias</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">{skill.icon}</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{skill.level}%</span>
              </div>
              <h3 className="font-bold mb-3">{skill.name}</h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-navy h-full rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAYECTORIA */}
      <section id="trayectoria" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl mb-12">Historial Estratégico</h2>
          <div className="space-y-8">
            {experience.map(exp => (
              <div key={exp.id} className="grid md:grid-cols-[1fr_3fr] gap-8 p-6 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase">{exp.period}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{exp.role} <span className="text-slate-400 font-normal">@ {exp.company}</span></h3>
                  <p className="text-slate-600 text-sm">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GEMINI AI ANALYZER */}
      <section id="ia" className="py-24 px-6 bg-navy text-white relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase mb-4 tracking-widest">
              <Sparkles size={16} /> Gemini Core Engine
            </div>
            <h2 className="font-serif text-5xl mb-6 leading-tight">Analista de <span className="gemini-gradient">Fit Inteligente</span></h2>
            <p className="text-slate-400 mb-8 max-w-md">No pierdas tiempo. Pega los requisitos de tu vacante y deja que nuestra IA analice el encaje real de Edward para tu equipo.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h4 className="text-emerald-400 text-xs font-bold uppercase mb-1">Análisis Semántico</h4>
                <p className="text-slate-300 text-sm">Compara keywords técnicas y soft-skills de liderazgo.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h4 className="text-emerald-400 text-xs font-bold uppercase mb-1">Veredicto Ejecutivo</h4>
                <p className="text-slate-300 text-sm">Resumen crítico sobre la viabilidad del candidato.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl text-navy">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="text-emerald-600" size={20} /> Validador de Vacante
            </h3>
            <textarea 
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Ej: Buscamos Desarrollador Python junior, con conocimientos en desarrollo backend y nociones básicas de AWS, motivado por seguir aprendiendo y crecer en entornos técnicos colaborativos..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:border-emerald-500 outline-none transition-all mb-4"
            />
            <button 
              onClick={handleAiAnalysis}
              disabled={isAnalyzing || !jdText}
              className="w-full py-4 bg-navy text-white rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" /> Analizando con Gemini...</> : <>✨ Calcular Encaje Crítico</>}
            </button>

            {aiAnalysis && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-2xl font-bold">
                    {aiAnalysis.score}%
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-600 uppercase text-xs tracking-widest">Análisis de Gemini</h4>
                    <p className="font-serif text-lg leading-tight">{aiAnalysis.veredicto || "Perfil Altamente Recomendado"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">{aiAnalysis.conclusion}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {aiAnalysis.pros?.map((pro, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        ✓ {pro}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        © 2026 Strategic Branding & Gemini Intelligence
      </footer>
    </div>
  );
};

export default App;
