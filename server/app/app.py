import psutil
import os


def log_memory_usage(label=""):
    process = psutil.Process(os.getpid())
    mem = process.memory_info().rss / (1024 ** 2)  # Convert to MB
    print(f"[{label}] Current memory usage: {mem:.2f}MB")

log_memory_usage("Start")

from flask import Flask, request, jsonify
import parselmouth
from io import BytesIO
import base64
import tempfile
import requests
from urllib.parse import unquote
from traceback import print_exc
from flask_cors import CORS

log_memory_usage("After imports")


app = Flask(__name__)

log_memory_usage("After app initialization")


# Set up CORS with specific options
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "supports_credentials": True
    }
})

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
    return "Hello, World! The app API is running."



@app.route('/analyze', methods=["POST"])
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


if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')  # Create 'uploads' directory if it doesn't exist
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)

