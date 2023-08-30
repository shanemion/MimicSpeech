from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import stripe
from flask_cors import CORS
from google.cloud import firestore

# Initialize Firestore
db = firestore.Client()

load_dotenv()

stripe_sk = os.getenv('REACT_APP_STRIPE_SK')
stripe.api_key = stripe_sk
stripe_webhook_secret = os.getenv('REACT_APP_STRIPE_WEBHOOK_SECRET')

app = Flask(__name__)
# Set up CORS with specific options
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "supports_credentials": True
    }
})

# Map plan names to Stripe Price IDs
# price_ids = {
#     'Pro': 'price_1NkOHeK0jBG5Bpil2Kew0nhx',
#     'Unlimited': 'price_1NkOI0K0jBG5BpilFolLW6xR'
# }

# test Stripe Price IDs
price_ids = {
    'Pro': 'price_1NkcTLK0jBG5BpilYyTCm9lA',
    'Unlimited': 'price_1NkcTZK0jBG5Bpil1EJBSW0w'
}


@app.route('/create-checkout-session', methods=['POST'])
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
            success_url='http://localhost:3000/payment-success?plan={}'.format(plan),
            cancel_url='http://localhost:3000/',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 403


credits_map = {
    'Pro': 15,
    'Unlimited': 30
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
        print(f"Webhook received user_id: {user_id}")  # Debug line

        plan = session['metadata'].get('plan', 'Free')

        credits_to_add = credits_map.get(plan, 0) 


        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if user_doc.exists:
           
            new_credits = user_doc.to_dict().get('credits', 0) + credits_to_add
            user_ref.update({'credits': new_credits})
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'failure', 'message': 'User not found'}), 404

    return 'Success', 200


if __name__ == '__main__':
    app.run(port=4242)
