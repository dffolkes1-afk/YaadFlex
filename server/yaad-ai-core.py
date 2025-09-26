from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import os

app = Flask(__name__)

# --- SECURE Firebase Setup (Environment Variables) ---
try:
    # Use secure environment variables instead of firebase-key.json
    firebase_config = {
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
    }
    
    if firebase_config["project_id"]:  # Check if Firebase is configured
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("🔥 Firebase initialized securely")
    else:
        db = None
        print("⚠️ Firebase not configured - using fallback mode")
except Exception as e:
    db = None
    print(f"⚠️ Firebase initialization failed: {e}")

# --- SECURE Gemini AI Setup (Environment Variable) ---
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    print("🤖 Gemini AI initialized securely")
else:
    print("⚠️ GEMINI_API_KEY not set - AI features disabled")

@app.route("/")
def home():
    return {"message": "🔥 YaadFlex Autonomous AI Core is online 🔥"}

# --- Example: AI Ride Pricing ---
@app.route("/price", methods=["POST"])
def price():
    if not gemini_api_key:
        return jsonify({"error": "AI pricing not available - API key not configured"}), 503
    
    data = request.json
    pickup = data.get("pickup")
    dropoff = data.get("dropoff")

    # Save trip request in Firestore (if configured)
    if db:
        try:
            db.collection("trips").add({"pickup": pickup, "dropoff": dropoff})
        except Exception as e:
            print(f"Firestore save error: {e}")

    # AI adjusts price
    prompt = f"Suggest a professional but fair taxi price from {pickup} to {dropoff} in Jamaica."
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)

        return jsonify({
            "pickup": pickup,
            "dropoff": dropoff,
            "ai_price": response.text.strip()
        })
    except Exception as e:
        return jsonify({"error": f"AI pricing error: {str(e)}"}), 503

# --- Example: AI Voice/Chat ---
@app.route("/chat", methods=["POST"])
def chat():
    if not gemini_api_key:
        return jsonify({"error": "AI chat not available - API key not configured"}), 503
    
    message = request.json.get("message")
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(message)
        return jsonify({"reply": response.text.strip()})
    except Exception as e:
        return jsonify({"error": f"AI chat error: {str(e)}"}), 503

# --- Example: AI Marketplace Item Suggestion ---
@app.route("/marketplace", methods=["POST"])
def marketplace():
    if not gemini_api_key:
        return jsonify({"error": "AI marketplace not available - API key not configured"}), 503
    
    item = request.json.get("item")
    prompt = f"Suggest how to market '{item}' in YaadFlex Global Shop with a short tagline."
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        return jsonify({"item": item, "tagline": response.text.strip()})
    except Exception as e:
        return jsonify({"error": f"AI marketplace error: {str(e)}"}), 503

# --- Health Check ---
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "firebase": "ready" if db else "not configured",
        "gemini": "ready" if gemini_api_key else "not configured",
        "message": "YaadFlex AI Core operational"
    })

if __name__ == "__main__":
    print("🚀 Starting YaadFlex AI Core...")
    print(f"🔥 Firebase: {'✅ Ready' if db else '❌ Not configured'}")
    print(f"🤖 Gemini AI: {'✅ Ready' if gemini_api_key else '❌ Not configured'}")
    app.run(host="0.0.0.0", port=8080, debug=True)