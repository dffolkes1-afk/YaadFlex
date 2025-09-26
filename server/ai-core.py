from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import os
import json

app = Flask(__name__)

# --- SECURE Firebase Setup (No JSON files!) ---
try:
    # Use environment variables instead of firebase-key.json
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
    
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    firebase_ready = True
    print("🔥 Firebase securely initialized")
except Exception as e:
    firebase_ready = False
    print(f"⚠️ Firebase not configured: {e}")

# --- SECURE Gemini AI Setup ---
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    gemini_ready = True
    print("🤖 Gemini AI securely initialized")
else:
    gemini_ready = False
    print("⚠️ Gemini API key not configured")

@app.route("/")
def home():
    status = {
        "message": "🔥 YaadFlex Autonomous AI Core is online 🔥",
        "firebase": "✅ Ready" if firebase_ready else "❌ Not configured",
        "gemini": "✅ Ready" if gemini_ready else "❌ Not configured",
        "system": "🌍 Global AI Empire Active"
    }
    return jsonify(status)

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "ai_core": "operational",
        "timestamp": "live"
    })

# --- AI Ride Pricing with Global Currency Support ---
@app.route("/price", methods=["POST"])
def price():
    if not gemini_ready:
        return jsonify({"error": "AI pricing not available"}), 503
        
    data = request.json
    pickup = data.get("pickup")
    dropoff = data.get("dropoff")
    currency = data.get("currency", "YFD")  # Default to YaadFlex global currency

    # Save trip request in Firestore (if available)
    if firebase_ready:
        try:
            db.collection("ai_trip_requests").add({
                "pickup": pickup, 
                "dropoff": dropoff,
                "currency": currency,
                "timestamp": firestore.SERVER_TIMESTAMP
            })
        except Exception as e:
            print(f"Firebase save error: {e}")

    # AI adjusts price with global currency support
    prompt = f"""
    As YaadFlex's AI pricing engine, calculate a fair taxi price from {pickup} to {dropoff}.
    Consider: distance, traffic, time of day, and local rates.
    Respond in {currency} currency.
    Format: Just the price with currency symbol (e.g., "150 YFD" or "$25 USD")
    Be professional and competitive.
    """
    
    try:
        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
        ai_price = response.text.strip()
        
        return jsonify({
            "pickup": pickup,
            "dropoff": dropoff,
            "currency": currency,
            "ai_price": ai_price,
            "confidence": "high",
            "system": "YaadFlex AI Pricing Engine"
        })
    except Exception as e:
        return jsonify({"error": "AI pricing temporarily unavailable"}), 503

# --- AI Voice/Chat for Global Support ---
@app.route("/chat", methods=["POST"])
def chat():
    if not gemini_ready:
        return jsonify({"error": "AI chat not available"}), 503
        
    message = request.json.get("message")
    user_language = request.json.get("language", "en")  # Language support
    
    prompt = f"""
    You are YaadFlex's AI assistant for the global money transfer and ride empire.
    Respond to: "{message}"
    
    Guidelines:
    - Be helpful and professional
    - Focus on YaadFlex services (money transfers, rides, global payments)
    - Mention our 195+ country coverage
    - Keep responses concise but informative
    - Language: {user_language}
    """
    
    try:
        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
        return jsonify({
            "reply": response.text.strip(),
            "language": user_language,
            "ai_agent": "YaadFlex Global Assistant"
        })
    except Exception as e:
        return jsonify({"error": "AI chat temporarily unavailable"}), 503

# --- AI Marketplace Item Optimization ---
@app.route("/marketplace", methods=["POST"])
def marketplace():
    if not gemini_ready:
        return jsonify({"error": "AI marketplace not available"}), 503
        
    item = request.json.get("item")
    target_market = request.json.get("market", "global")
    
    prompt = f"""
    As YaadFlex's AI marketing expert, create compelling marketing for "{item}" in our global marketplace.
    Target market: {target_market}
    
    Provide:
    1. Catchy title (max 50 characters)
    2. Marketing tagline (max 80 characters)  
    3. Key selling points (3 bullet points)
    
    Focus on global appeal, quality, and YaadFlex reliability.
    Format as JSON with keys: title, tagline, selling_points
    """
    
    try:
        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
        
        # Try to parse as JSON, fallback to text if needed
        try:
            ai_response = json.loads(response.text.strip())
        except:
            ai_response = {
                "title": f"Premium {item}",
                "tagline": response.text.strip()[:80],
                "selling_points": ["Global shipping", "YaadFlex quality", "Competitive pricing"]
            }
        
        return jsonify({
            "item": item,
            "market": target_market,
            "ai_marketing": ai_response,
            "system": "YaadFlex AI Marketing Engine"
        })
    except Exception as e:
        return jsonify({"error": "AI marketing temporarily unavailable"}), 503

# --- AI Fraud Detection for Transfers ---
@app.route("/fraud-check", methods=["POST"])
def fraud_check():
    if not gemini_ready:
        return jsonify({"error": "AI fraud detection not available"}), 503
        
    data = request.json
    transaction_data = {
        "amount": data.get("amount"),
        "currency": data.get("currency"),
        "from_country": data.get("from_country"),
        "to_country": data.get("to_country"),
        "user_history": data.get("user_history", "normal")
    }
    
    prompt = f"""
    As YaadFlex's AI fraud detection system, analyze this transaction:
    Amount: {transaction_data['amount']} {transaction_data['currency']}
    From: {transaction_data['from_country']} → To: {transaction_data['to_country']}
    User history: {transaction_data['user_history']}
    
    Provide risk assessment (low/medium/high) and reason.
    Format: {{"risk_level": "low/medium/high", "reason": "explanation", "recommend": "approve/review/block"}}
    """
    
    try:
        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
        
        # Parse AI response for fraud assessment
        try:
            ai_assessment = json.loads(response.text.strip())
        except:
            ai_assessment = {
                "risk_level": "medium",
                "reason": "Unable to analyze - manual review required",
                "recommend": "review"
            }
        
        return jsonify({
            "transaction": transaction_data,
            "ai_assessment": ai_assessment,
            "system": "YaadFlex AI Fraud Detection"
        })
    except Exception as e:
        return jsonify({"error": "AI fraud detection temporarily unavailable"}), 503

if __name__ == "__main__":
    print("🚀 Starting YaadFlex AI Core on port 8080...")
    app.run(host="0.0.0.0", port=8080, debug=True)