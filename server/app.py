from flask import Flask, request, jsonify
import parselmouth
import numpy as np
import io
from io import BytesIO
import wave
import os
import base64
import tempfile
import requests
from urllib.parse import unquote
from traceback import print_exc
from flask_cors import CORS

app = Flask(__name__)

# Set up CORS with specific options
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "supports_credentials": True
    }
})

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
        os.makedirs('uploads') # Create 'uploads' directory if it doesn't exist
    app.run(debug=True)
