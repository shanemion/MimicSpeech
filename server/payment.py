from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import stripe
from flask_cors import CORS
from google.cloud import firestore
from celery import Celery
from datetime import datetime

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
            cancel_url='http://localhost:3000/dashboard',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 403
    

@app.route('/cancel-subscription', methods=['POST'])
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
    'Pro': 15,
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
    app.run(port=4242)
