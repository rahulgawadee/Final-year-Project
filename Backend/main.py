from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import tensorflow as tf
import base64
from inference_sdk import InferenceHTTPClient, InferenceConfiguration
from PIL import Image, ImageDraw
import io
import json
import time
from collections import Counter
from fastapi.responses import FileResponse
from PIL import ImageStat
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    model = tf.keras.models.load_model("saved_model/my_model.h5")
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])  # Fix
except Exception as e:
    print(f"Error loading model: {e}")
    model = None


# Roboflow API Client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="KOdTwjjvtG3ulM6LoHrG"
)

custom_configuration = InferenceConfiguration(confidence_threshold=0.1)
def detect_material(image):
    """Basic material classification using color and texture analysis."""
    # Example logic (can be replaced with ML model)
    avg_color = ImageStat.Stat(image).mean  # Get average color values
    if avg_color[0] > 180 and avg_color[1] > 180 and avg_color[2] > 180:
        return "Cotton"
    elif avg_color[0] < 100 and avg_color[1] < 100 and avg_color[2] < 100:
        return "Wool"
    else:
        return "Polyester"

def get_dominant_color(image):
    """Extract the dominant color of the fabric."""
    img = image.convert("RGB")
    pixels = list(img.getdata())
    most_common_color = Counter(pixels).most_common(1)[0][0]
    return f"RGB{most_common_color}"

def estimate_thread_count(image):
    """Simple estimation of thread count based on image texture (placeholder)."""
    width, height = image.size
    return int((width * height) / 10000)  # Approximation
def process_frame(image):
    """Processes an image to detect defects, material, color, and thread count."""
    try:
        if not image:
            raise ValueError("Invalid image input")

        image = image.resize((800, 600))

        with CLIENT.use_configuration(custom_configuration):
            result = CLIENT.infer(image, model_id="fabric_detection/2")

        processed_image = draw_bounding_boxes(image, result)

        # Calculate defect percentage
        total_area = image.width * image.height
        defect_area = sum(pred['width'] * pred['height'] for pred in result.get('predictions', []))
        defect_percentage = (defect_area / total_area) * 100 if total_area else 0

        # Extract material, color, and thread count with safe defaults
        material = detect_material(image) or "Unknown"
        dominant_color = get_dominant_color(image) or "Not detected"
        thread_count = estimate_thread_count(image) or "N/A"

        # Convert processed image to base64
        buffered = io.BytesIO()
        processed_image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "image": img_str,
            "defect_percentage": round(defect_percentage, 2),
            "detections": result.get("predictions", []),
            "material": material,
            "color": dominant_color,
            "thread_count": thread_count,
        }
    except Exception as e:
        print(f"[ERROR] process_frame: {e}")  # Improved error logging
        return {
            "image": None,
            "defect_percentage": 0,
            "detections": [],
            "material": "Unknown",
            "color": "Not detected",
            "thread_count": "N/A",
            "error": str(e),
        }
def draw_bounding_boxes(image, result):
    """Draw bounding boxes on an image and return it."""
    draw = ImageDraw.Draw(image)
    
    for prediction in result.get('predictions', []):
        x1 = prediction['x'] - prediction['width'] / 2
        y1 = prediction['y'] - prediction['height'] / 2
        x2 = prediction['x'] + prediction['width'] / 2
        y2 = prediction['y'] + prediction['height'] / 2

        draw.rectangle([x1, y1, x2, y2], outline="green", width=3)
    
    return image

def process_frame(image):
    """Process each video frame and return detected defects with bounding boxes."""
    image = image.resize((800, 600))
    
    with CLIENT.use_configuration(custom_configuration):
        result = CLIENT.infer(image, model_id="fabric_detection/2")
    
    processed_image = draw_bounding_boxes(image, result)
    
    total_area = image.size[0] * image.size[1]
    defect_area = sum(prediction['width'] * prediction['height'] for prediction in result.get('predictions', []))
    defect_percentage = (defect_area / total_area) * 100
    
    buffered = io.BytesIO()
    processed_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return {"image": img_str, "defect_percentage": defect_percentage, "detections": result.get('predictions', [])}

def generate_pdf_report(defect_percentage, detections, material, color, thread_count):
    """Generate a PDF report including material, color, and thread count."""
    pdf_filename = "fabric_defect_report.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=letter)
    c.drawString(100, 750, "Fabric Analysis Report")
    c.drawString(100, 730, f"Defect Percentage: {defect_percentage:.2f}%")
    c.drawString(100, 710, f"Material: {material}")
    c.drawString(100, 690, f"Dominant Color: {color}")
    c.drawString(100, 670, f"Estimated Thread Count: {thread_count}")

    c.drawString(100, 650, "Detected Defects:")
    y_position = 630

    for detection in detections:
        c.drawString(120, y_position, f"Type: {detection['class']}, Confidence: {detection['confidence']:.2f}")
        y_position -= 20

    c.save()
    return pdf_filename

@app.websocket("/video_feed")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    cap = cv2.VideoCapture(0)  # Open default camera
    if not cap.isOpened():
        await websocket.send_text(json.dumps({"error": "Camera not found"}))
        await websocket.close()
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                await websocket.send_text(json.dumps({"error": "Failed to capture frame"}))
                continue

            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            result = process_frame(image)

            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        cap.release()
        await websocket.close()

@app.post("/detect/")
async def detect_fabric(file: UploadFile = File(...)):
    """Receive an image, process it, and return analysis including material and color."""
    try:
        print(f"Received file: {file.filename}")  # Debugging print

        image = Image.open(io.BytesIO(await file.read()))
        print("Image successfully opened.")  # Debugging print

        result = process_frame(image)
        print("Processing result:", result)  # Debugging print

        if not result.get("image"):
            raise HTTPException(status_code=500, detail="Image processing failed.")

        defect_percentage = result.get("defect_percentage", 0)
        detections = result.get("detections", [])
        material = result.get("material", "Unknown")
        color = result.get("color", "Not detected")
        thread_count = result.get("thread_count", "N/A")

        pdf_path = generate_pdf_report(defect_percentage, detections, material, color, thread_count)
        return {**result, "report_url": "/download_report"}

    except Exception as e:
        print(f"Error processing request: {e}")  # ✅ Log errors for debugging
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")

def generate_pdf_report(defect_percentage, detections, material, color, thread_count):
    """Generate a PDF report including material, color, and thread count."""
    pdf_filename = "fabric_defect_report.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=letter)
    c.drawString(100, 750, "Fabric Analysis Report")
    c.drawString(100, 730, f"Defect Percentage: {defect_percentage:.2f}%")
    c.drawString(100, 710, f"Material: {material}")
    c.drawString(100, 690, f"Dominant Color: {color}")
    c.drawString(100, 670, f"Estimated Thread Count: {thread_count}")
    
    c.drawString(100, 650, "Detected Defects:")
    y_position = 630
    
    for detection in detections:
        c.drawString(120, y_position, f"Type: {detection['class']}, Confidence: {detection['confidence']:.2f}")
        y_position -= 20
    
    c.save()
    return pdf_filename

@app.get("/download_report/")
async def download_report():
    """Serve the generated PDF report as a downloadable file."""
    pdf_path = "fabric_defect_report.pdf"
    return FileResponse(
        pdf_path, 
        media_type="application/pdf", 
        filename="Fabric_Defect_Report.pdf"
    )
