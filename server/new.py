import os
import parselmouth
import base64
import tempfile
import requests
from io import BytesIO
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import stripe
from flask_cors import CORS
from google.cloud import firestore
from traceback import print_exc
import firebase_admin
from firebase_admin import auth, credentials
from functools import wraps


load_dotenv()

stripe_sk = os.getenv('REACT_APP_STRIPE_SK')
stripe.api_key = stripe_sk
stripe_webhook_secret = os.getenv('REACT_APP_STRIPE_WEBHOOK_SECRET')

# Initialize Firebase Admin SDK
# cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
# cred = credentials.Certificate(cred_path)
# firebase_admin.initialize_app(cred)
import firebase_admin
from firebase_admin import credentials

# Fetch environment variables
type = os.environ['TYPE']
project_id = os.environ['PROJECT_ID']
private_key_id = os.environ['PRIVATE_KEY_ID']
private_key = os.environ['PRIVATE_KEY'].replace('\\n', '\n')
client_email = os.environ['CLIENT_EMAIL']
client_id = os.environ['CLIENT_ID']
auth_uri = os.environ['AUTH_URI']
token_uri = os.environ['TOKEN_URI']
auth_provider_x509_cert_url = os.environ['AUTH_PROVIDER_X509_CERT_URL']
client_x509_cert_url = os.environ['CLIENT_X509_CERT_URL']
universe_domain = os.environ['UNIVERSE_DOMAIN']

# Construct the credentials object
cred_dict = {
    'type': 'service_account',
    'project_id': project_id,
    'private_key_id': private_key_id,
    'private_key': private_key,
    'client_email': client_email,
    'client_id': client_id,
    'auth_uri': auth_uri,
    'token_uri': token_uri,
    'auth_provider_x509_cert_url': auth_provider_x509_cert_url,
    'client_x509_cert_url': client_x509_cert_url,
    'universe_domain': universe_domain
}
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)


app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://mimicspeech.com", "https://mimicspeech.web.app"],
        "supports_credentials": True
    }
})


def authenticate_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        if not id_token or 'Bearer ' not in id_token:
            print("top auth error")
            return jsonify({"error": "Authorization header missing or not in expected format"}), 403
            
        id_token = id_token.split('Bearer ')[1]
        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token
            print(f"Authenticated user: {decoded_token}")
            print("i think you did it")
        except Exception as e:  # You can narrow down the exception if you know what exceptions are possible
            print("other auth error")
            return jsonify({"error": "Authentication failed", "details": str(e)}), 403
        return f(*args, **kwargs)
    return decorated_function




def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


def analyze_pitch(base64_audio):
    # Decode the base64 audio data
    audio_data = base64.b64decode(base64_audio)

    # Create a temporary file and write the audio data to it
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_file.write(audio_data)
        temp_file_path = temp_file.name

    # Read the audio data from the temporary file
    sound = parselmouth.Sound(temp_file_path)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']

    # Delete the temporary file
    os.remove(temp_file_path)

    return pitch_values.tolist()



def extract_base64(data_uri):
    if data_uri is None or ";base64," not in data_uri:
        return None
    return data_uri.split(";base64,")[1]


@app.route('/')
def index():
    return "Hello, World! The api is running."



@app.route('/mimicspeech/analyze', methods=["POST"])
@authenticate_request
def analyze_user_rec():
    try:
        synthesized_audio_url = request.json['synthesized_audio_url']
        recorded_audio_url = request.json['recorded_audio_url']

        print("Received Synthesized Audio URL:", synthesized_audio_url)
        print("Received Recorded Audio URL:", recorded_audio_url)

        # Check if the URLs are None
        if not synthesized_audio_url or not recorded_audio_url:
            return jsonify(error="No valid audio URLs provided"), 400

        # Handle synthesized audio data retrieval
        if synthesized_audio_url.startswith("data:audio/wav;base64,"):
            audio_data = base64.b64decode(synthesized_audio_url.split(",")[1])
            synthesized_audio_data = BytesIO(audio_data).getvalue()  # Convert BytesIO to bytes
        else:
            # Download the synthesized audio if it's a direct link
            synthesized_audio_data = requests.get(synthesized_audio_url).content

        # Handle recorded audio data retrieval
        if recorded_audio_url.startswith("data:audio/wav;base64,"):
            audio_data = base64.b64decode(recorded_audio_url.split(",")[1])
            recorded_audio_data = BytesIO(audio_data).getvalue()  # Convert BytesIO to bytes
        else:
            # Download the recorded audio if it's a direct link
            recorded_audio_data = requests.get(recorded_audio_url).content

        # Convert the audio data to base64
        synthesized_base64 = base64.b64encode(synthesized_audio_data).decode('utf-8')
        recorded_base64 = base64.b64encode(recorded_audio_data).decode('utf-8')

        synthesized_pitch_data = analyze_pitch(synthesized_base64)
        recorded_pitch_data = analyze_pitch(recorded_base64)

        return jsonify(synthesized_pitch_data=synthesized_pitch_data, recorded_pitch_data=recorded_pitch_data)
    except Exception as e:
        print_exc() # Print the traceback
        return jsonify(error=str(e)), 500


db = firestore.Client()


price_ids = {
    'Pro': 'price_1NkOHeK0jBG5Bpil2Kew0nhx',
    'Unlimited': 'price_1NseXeK0jBG5Bpilgy7wo3BS'
}


@app.route('/mimicspeech/create-checkout-session', methods=['POST'])
@authenticate_request
def create_checkout_session():
    try:
        user_id = request.json['user_id']
        print(f"Received user_id: {user_id}")  # Debug line

        plan = request.json['plan']
        price_id = price_ids.get(plan)  # Get the Stripe Price ID for the selected plan

        if not price_id:
            return jsonify({'error': 'Invalid plan name'}), 400

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            metadata={
                'firebase_user_id': user_id,
                'plan': plan  # Add plan to metadata
            },
            mode='subscription',
            # success_url='http://localhost:3000/payment-success?plan={}'.format(plan),
            # cancel_url='http://localhost:3000/dashboard',
            success_url='https://mimicspeech.web.app/payment-success?plan={}'.format(plan),
            cancel_url='https://mimicspeech.web.app/dashboard',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 403
    

@app.route('/mimicspeech/cancel-subscription', methods=['POST'])
@authenticate_request
def cancel_subscription():
    try:
        user_id = request.json['user_id']
        print(f"Received user_id: {user_id}")  # Debug line

        # Fetch the subscription ID from Firestore based on the user_id
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if user_doc.exists:
            subscription_id = request.json['subscriptionId']
            if not subscription_id:
                return jsonify({'status': 'failure', 'message': 'No subscription found'}), 404

            # Perform Stripe API call to cancel the subscription
            stripe_response = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True,
            )
            print(f"Stripe response: {stripe_response}")
            if not stripe_response or stripe_response.status != 'active':
                return jsonify({'status': 'failure', 'message': 'Failed to cancel subscription on Stripe'}), 500

            # Update Firestore to indicate the user's subscription is canceled
            update_response = user_ref.update({
                'subscriptionId': None,
                'plan': 'Free'
            })

            if not update_response:
                return jsonify({'status': 'failure', 'message': 'Failed to update Firestore'}), 500

            return jsonify({'status': 'success'})

        else:
            return jsonify({'status': 'failure', 'message': 'User not found'}), 404

    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({'status': 'failure', 'message': str(e)}), 500



credits_map = {
    'Pro': 30,
    'Unlimited': float('inf')
}

@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data.decode('utf-8')
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_webhook_secret
        )
    except ValueError as e:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        return 'Invalid signature', 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['firebase_user_id']
        stripe_customer_id = session['customer']  # This should have the Stripe Customer ID

        subscription_id = session.get('subscription', None)  # Fetching subscription ID
        print(f"Webhook received user_id: {user_id}, subscription_id: {subscription_id}")  # Debug line

        plan = session['metadata'].get('plan', 'Free')
        credits_to_add = credits_map.get(plan, 0)  # Assume credits_map is a predefined dictionary

        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if user_doc.exists:
            update_data = {
                'credits': user_doc.to_dict().get('credits', 0) + credits_to_add,
                'subscriptionId': subscription_id,  # Storing subscription ID
                'plan': plan,
                'stripeCustomerId': stripe_customer_id,
            }
            user_ref.update(update_data)
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'failure', 'message': 'User not found'}), 404

    if event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        stripe_customer_id = subscription['customer']  # This should have the Stripe Customer ID

        # Query Firestore to find the user with this Stripe Customer ID
        users_ref = db.collection('users')
        query = users_ref.where('stripeCustomerId', '==', stripe_customer_id).stream()

        user_data = None
        for doc in query:
            user_data = doc.to_dict()

        if user_data:
            user_id = doc.id  # The Firestore document ID, which is the user's ID
            user_ref = db.collection('users').document(user_id)

            # Your logic to set the subscription to 'Free' and credits to 0
            update_data = {
                'subscriptionId': None,
                'plan': 'Free',
                'credits': 0
            }
            user_ref.update(update_data)
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'failure', 'message': 'User not found'}), 404


    return 'Success', 200



if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')  # Create 'uploads' directory if it doesn't exist
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
