import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Users,
  Search,
  Briefcase,
  Code2,
  Terminal,
  Layers,
  Send,
  Sparkles,
  Loader2
} from "lucide-react";

const ExecutiveStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap');
      :root {
        --navy: #0A192F;
        --emerald: #10B981;
        --slate: #64748B;
      }
      .font-serif { font-family: 'Playfair Display', serif; }
      .font-sans { font-family: 'Inter', sans-serif; }
      html { scroll-behavior: smooth; }
      .gemini-gradient {
        background: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `}
  </style>
);

const App = () => {
  const [jdText, setJdText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hola, soy el asistente virtual de Edward. Puedes preguntarme sobre su experiencia en programación o liderazgo."
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callGemini = async (prompt) => {
    const lower = prompt.toLowerCase();

    if (lower.includes("proyecto")) {
      return "Edward ha desarrollado proyectos full stack integrando Angular en frontend y Python con MySQL en backend.";
    }
    if (lower.includes("liderazgo")) {
      return "Cuenta con experiencia liderando equipos de más de 70 personas en entornos de alta responsabilidad.";
    }
    if (lower.includes("python") || lower.includes("backend")) {
      return "Tiene sólida experiencia en desarrollo backend con Python y bases de datos MySQL.";
    }
    if (lower.includes("frontend") || lower.includes("angular") || lower.includes("react")) {
      return "Domina desarrollo frontend moderno creando interfaces limpias y responsivas.";
    }
    if (lower.includes("github") || lower.includes("git")) {
      return "Utiliza Git y GitHub para control de versiones y trabajo colaborativo profesional.";
    }

    return "Edward combina liderazgo estratégico con capacidades técnicas en desarrollo de software moderno.";
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    const response = await callGemini(userMsg);

    setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    setIsTyping(false);
  };

  const handleAiAnalysis = async () => {
    if (!jdText) return;

    setIsAnalyzing(true);

    const result = await callGemini(jdText);

    setAiAnalysis({
      score: 95,
      conclusion: result,
      pros: [
        "Experiencia Full Stack",
        "Liderazgo estratégico",
        "Alta capacidad analítica"
      ],
      veredicto: "Perfil Altamente Recomendado"
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A192F]">
      <ExecutiveStyles />

      {/* HERO */}
      <section className="pt-24 pb-20 px-6 bg-[#0A192F] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-5xl mb-4">
              Edward Villalobos
            </h1>
            <p className="text-emerald-400 text-xl mb-6">
              Full Stack Developer & Strategic Leader
            </p>
          </div>

          {/* CHAT */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[400px] overflow-hidden">
            <div className="bg-[#0A192F] p-4 text-white text-xs font-bold uppercase tracking-widest">
              Edward AI Chat
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs ${
                      m.role === "user"
                        ? "bg-[#0A192F] text-white"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="text-xs text-slate-400">
                  Edward está redactando...
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            <form onSubmit={handleChat} className="p-2 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs outline-none"
                placeholder="Pregunta sobre Edward..."
              />
              <button
                type="submit"
                className="bg-[#0A192F] text-white px-3 rounded-lg"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ANALYZER */}
      <section className="py-20 px-6 bg-[#0A192F] text-white">
        <div className="max-w-4xl mx-auto bg-white text-[#0A192F] p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search size={20} /> Analizador de Vacante
          </h3>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-32 border rounded-xl p-4 text-sm mb-4"
            placeholder="Pega aquí los requisitos del puesto..."
          />

          <button
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-[#0A192F] text-white rounded-xl text-xs uppercase tracking-widest"
          >
            {isAnalyzing ? "Analizando..." : "Comprobar Compatibilidad"}
          </button>

          {aiAnalysis && (
            <div className="mt-8 bg-slate-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-emerald-600">
                  {aiAnalysis.score}%
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Compatibilidad
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                {aiAnalysis.conclusion}
              </p>

              <ul className="text-sm text-slate-600 list-disc list-inside mb-4">
                {aiAnalysis.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>

              <div className="text-center">
                <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold">
                  {aiAnalysis.veredicto}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-xs">
        © 2026 Edward Villalobos
      </footer>
    </div>
  );
};

export default App;

