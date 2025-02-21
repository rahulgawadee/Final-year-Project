from inference_sdk import InferenceHTTPClient, InferenceConfiguration
from PIL import Image, ImageDraw
import tensorflow as tf

# Example simple model architecture for demonstration
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Save the model in .h5 format
model.save('saved_model/my_model.h5')
print("Model saved as my_model.h5")

# Image path with raw string literal for Windows file path compatibility
image_path = r"captured/Hole/20180531_135129(1).jpg"
resized_image_path = "resized_image.jpg"
output_image_path = "output_with_boxes.jpg"  # Output path for image with bounding boxes

# Resize the image
with Image.open(image_path) as img:
    img = img.resize((800, 600))  # Adjust dimensions as needed
    img.save(resized_image_path)

custom_configuration = InferenceConfiguration(confidence_threshold=0.1)

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="KOdTwjjvtG3ulM6LoHrG"
)

def draw_bounding_boxes(image_path, result, output_path):
    """Draw bounding boxes on an image and save it."""
    with Image.open(image_path) as img:
        draw = ImageDraw.Draw(img)
        
        # Assuming result['predictions'] contains bounding box data
        for prediction in result.get('predictions', []):
            x1 = prediction['x'] - prediction['width'] / 2
            y1 = prediction['y'] - prediction['height'] / 2
            x2 = prediction['x'] + prediction['width'] / 2
            y2 = prediction['y'] + prediction['height'] / 2
            
            # Draw the bounding box (green with thickness 3)
            draw.rectangle([x1, y1, x2, y2], outline="green", width=3)
        
        img.save(output_path)
        print(f"Image with bounding boxes saved at {output_path}")

with CLIENT.use_configuration(custom_configuration):
    result = CLIENT.infer(resized_image_path, model_id="fabric_detection/2")
    draw_bounding_boxes(resized_image_path, result, output_image_path)

with CLIENT.use_model("fabric_detection/2"):
    result = CLIENT.infer(resized_image_path)
    draw_bounding_boxes(resized_image_path, result, "output_with_boxes_model.jpg")

# After leaving context manager - `model_id` is still required
result = CLIENT.infer(resized_image_path, model_id="fabric_detection/2")
draw_bounding_boxes(resized_image_path, result, "output_with_boxes_final.jpg")

print("Image with bounding boxes saved at output_with_boxes.jpg")