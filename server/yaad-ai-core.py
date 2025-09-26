from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# --- Initialize Firebase (Secure way) ---
firebase_ready = False
db = None

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # Use environment variables instead of firebase-key.json
    firebase_project_id = os.getenv("FIREBASE_PROJECT_ID")
    firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    firebase_client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    
    if firebase_project_id and firebase_private_key and firebase_client_email:
        firebase_config = {
            "type": "service_account",
            "project_id": firebase_project_id,
            "private_key": firebase_private_key.replace('\\n', '\n'),
            "client_email": firebase_client_email,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
        }
        
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_ready = True
        print("🔥 Firebase initialized securely")
    else:
        print("⚠️ Firebase credentials not found in environment variables")
        
except Exception as e:
    print(f"⚠️ Firebase setup error: {e}")

# --- Initialize Gemini AI (Secure way) ---
gemini_ready = False
genai = None

try:
    import google.generativeai as genai_module
    
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if gemini_api_key:
        genai_module.configure(api_key=gemini_api_key)
        genai = genai_module
        gemini_ready = True
        print("🤖 Gemini AI initialized securely")
    else:
        print("⚠️ GEMINI_API_KEY not found in environment variables")
        
except Exception as e:
    print(f"⚠️ Gemini AI setup error: {e}")

@app.route("/")
def home():
    return {"message": "🔥 YaadFlex Autonomous AI Core is online 🔥"}

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "firebase": "ready" if firebase_ready else "not configured",
        "gemini": "ready" if gemini_ready else "not configured",
        "message": "YaadFlex AI Core operational"
    })

# --- AI Ride Pricing ---
@app.route("/price", methods=["POST"])
def price():
    if not gemini_ready:
        return jsonify({"error": "AI pricing not available - Gemini API key needed"}), 503
    
    data = request.json or {}
    pickup = data.get("pickup", "Unknown")
    dropoff = data.get("dropoff", "Unknown")

    # Save trip request in Firestore (if available)
    if firebase_ready and db:
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
            "ai_price": response.text.strip() if response.text else "Price calculation unavailable"
        })
    except Exception as e:
        return jsonify({"error": f"AI pricing error: {str(e)}"}), 503

# --- AI Voice/Chat ---
@app.route("/chat", methods=["POST"])
def chat():
    if not gemini_ready:
        return jsonify({"error": "AI chat not available - Gemini API key needed"}), 503
    
    data = request.json or {}
    message = data.get("message", "")
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(message)
        
        return jsonify({
            "reply": response.text.strip() if response.text else "AI response unavailable"
        })
    except Exception as e:
        return jsonify({"error": f"AI chat error: {str(e)}"}), 503

# --- AI Marketplace Item Suggestion ---
@app.route("/marketplace", methods=["POST"])
def marketplace():
    if not gemini_ready:
        return jsonify({"error": "AI marketplace not available - Gemini API key needed"}), 503
    
    data = request.json or {}
    item = data.get("item", "")
    
    if not item:
        return jsonify({"error": "No item provided"}), 400
    
    prompt = f"Suggest how to market '{item}' in YaadFlex Global Shop with a short tagline."
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        
        return jsonify({
            "item": item,
            "tagline": response.text.strip() if response.text else "Marketing suggestion unavailable"
        })
    except Exception as e:
        return jsonify({"error": f"AI marketplace error: {str(e)}"}), 503

if __name__ == "__main__":
    print("🚀 Starting YaadFlex AI Core...")
    print(f"🔥 Firebase: {'✅ Ready' if firebase_ready else '❌ Not configured'}")
    print(f"🤖 Gemini AI: {'✅ Ready' if gemini_ready else '❌ Not configured'}")
    print("📡 Running on http://0.0.0.0:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)