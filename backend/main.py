from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos
class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"status": "Backend FastAPI activo"}


# 🔹 FUNCIÓN DE RESPUESTA SIMULADA
def generate_response(message: str) -> str:
    text = message.lower()

    if "experiencia" in text:
        return "Edward es licenciado en Ciencias y Artes Aeronáuticas con una mención en Logística y actualmente es desarrollador full stack y mantiene un proceso continuo de formación."

    elif "programar" in text or "importancia de la programación" in text:
        return "La programación promueve el pensamiento lógico, el razonamiento estructurado y una mayor comprensión del ámbito tecnológico. Además, facilita la resolución de problemas complejos y abre un abanico amplio de oportunidades laborales en diferentes sectores."

    elif "habilidades" in text or "skills" in text:
        return "Maneja Python, JavaScript, Angular, FastAPI, GitHub, MySQL y desarrollo frontend y backend."

    elif "contacto" in text:
        return "Puedes contactar a Edward a través de LinkedIn o mediante el formulario del portafolio."

    elif any(word in text for word in ("proyecto", "proyectos")):
        return "Ha desarrollado proyectos full stack conectando frontend con backend usando FastAPI y frameworks modernos, incluyendo Angular y este portafolio interactivo."

    else:
        return "Gracias por tu pregunta. Edward es un profesional técnico en transición hacia el desarrollo de software."


@app.post("/chat")
def chat(request: ChatRequest):
    response = generate_response(request.message)
    return {"response": response}
