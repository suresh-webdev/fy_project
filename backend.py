import cv2
import mediapipe as mp
import json
import time
import pymongo
from flask import request
import threading
from datetime import datetime
from flask import Flask, Response, jsonify,stream_with_context
from flask_socketio import SocketIO, emit
from flask_cors import CORS


# Initialize Flask and SocketIO
app = Flask(__name__)
CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

# Initialize MediaPipe Hand model
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

# MongoDB connection setup
client = pymongo.MongoClient("mongodb+srv://new:new@client.d8j8m.mongodb.net/?retryWrites=true&w=majority&appName=Client")
db = client["oee_db"]
collection = db["oee_data"]

# Prompt user for user_id, target count, and number of working areas
user_id = input("Enter your user_id: ")
target_count = int(input("Enter your target count: "))
num_working_areas = int(input("Enter the number of working areas: "))

# Initialize area coordinates
working_areas = [None] * num_working_areas
main_area = None


# Global variables
total_count = 0
completed_count = 0
violated_count = 0
yet_to_complete_count = target_count
frame = None  # Initialize frame as a global variable


# Create the video stream generator
def generate_video_stream():
    global frame
    while True:
        if frame is not None:  # Ensure frame is not None
            ret, jpeg = cv2.imencode('.jpg', frame)  # Encode frame as JPEG
            if ret:
                # Convert the frame to bytes and yield it as part of multipart response
                frame_bytes = jpeg.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# Function to check if a point is within a specific area
def is_in_area(point, area):
    if area is None:
        return False
    (x, y) = point
    (x1, y1), (x2, y2) = area
    return x1 <= x <= x2 and y1 <= y <= y2

# Function to get the area name based on coordinates
def get_area_name(x, y):
    for i, area in enumerate(working_areas):
        if is_in_area((x, y), area):
            return f"Working Area {i + 1}"
    if is_in_area((x, y), main_area):
        return "Main Area"
    return None

# Function to check if the sequence is correct
def check_sequence(current_sequence, expected_sequence):
    return current_sequence == expected_sequence

# Define function to calculate metrics and update MongoDB
def update_mongodb(sop_violation):
    global completed_count, violated_count, yet_to_complete_count, total_count, availability, performance, maintenance, timestamp, target_count
    total_count = completed_count + violated_count + yet_to_complete_count
    availability = (completed_count / total_count) * 100 if total_count > 0 else 0
    performance = (completed_count / (completed_count + violated_count)) * 100 if (completed_count + violated_count) > 0 else 0
    maintenance = (completed_count / total_count) * 100 if total_count > 0 else 0
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("The steps are",num_working_areas)
    data = {
        "user_id": user_id,
        "availability": availability,
        "performance": performance,
        "maintenance": maintenance,
        "completed_count": completed_count,
        "violated_count": violated_count,
        "yet_to_complete_count": yet_to_complete_count,
        "total_count": total_count,
        "sop_violation": sop_violation,
        "target": target_count,
        "timestamp": timestamp,
        "steps":num_working_areas,
        "current_sequence":current_sequence
    }

    collection.update_one({"user_id": user_id}, {"$set": data}, upsert=True)
    print(f"Data for user {user_id} updated in MongoDB: {data}")
    
    # socketio.emit('performance_data', {
    #     'totalCount': total_count,
    #     'sopViolation': violated_count,
    #     'target': target_count
    # })

# Mouse callback function for selecting areas
def mouse_callback(event, x, y, flags, param):
    global start_point, end_point, selecting, selected_area
    selecting = False

    if event == cv2.EVENT_LBUTTONDOWN:
        start_point = (x, y)
        selecting = True

    elif event == cv2.EVENT_MOUSEMOVE:
        if selecting:
            end_point = (x, y)

    elif event == cv2.EVENT_LBUTTONUP:
        end_point = (x, y)
        selecting = False
        if start_point and end_point:
            if selected_area.startswith("Working Area"):
                index = int(selected_area.split()[-1]) - 1
                working_areas[index] = (start_point, end_point)
                print(f"{selected_area} set to: {start_point} to {end_point}")
            elif selected_area == "Main Area":
                global main_area
                main_area = (start_point, end_point)
                print(f"Main Area set to: {start_point} to {end_point}")

# Function to process frames and track hand movements
def process():
    global frame, completed_count, violated_count, yet_to_complete_count
    global violation_detected,start_time,last_cycle_time,cycle_completed,current_sequence,expected_sequence
    completed_count = 0
    violated_count = 0
    yet_to_complete_count = target_count
    violation_detected = False
    start_time = None
    cycle_completed = False
    last_cycle_time = time.time()
    expected_sequence = []
    for i in range(num_working_areas):
        expected_sequence.append(f"Working Area {i + 1}")
        expected_sequence.append("Main Area")
    current_sequence = []

    cap = cv2.VideoCapture(0)
    cv2.namedWindow("Hand Tracking")
    cv2.setMouseCallback("Hand Tracking", mouse_callback)
    
    # flipped = False
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # frame_queue.put(frame) 
        # if not flipped:
        frame = cv2.flip(frame, 1)
        # flipped = True
        h, w, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        # Draw selected regions on the frame
        for i, area in enumerate(working_areas):
            if area:
                cv2.rectangle(frame, area[0], area[1], (0, 255, 0), 2)
                cv2.putText(frame, f"Working Area {i + 1}", (area[0][0], area[0][1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        if main_area:
            cv2.rectangle(frame, main_area[0], main_area[1], (255, 0, 0), 2)
            cv2.putText(frame, "Main Area", (main_area[0][0], main_area[0][1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

        # Process hand landmarks if detected and no violation
        

        if results.multi_hand_landmarks and not violation_detected:
            for hand_landmarks in results.multi_hand_landmarks:
                x = int(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * w)
                y = int(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * h)

                # Get current area
                area_name = get_area_name(x, y)
                if area_name and (not current_sequence or current_sequence[-1] != area_name):
                    current_sequence.append(area_name)
                    print(f"Moved to: {area_name}")
                    cv2.putText(frame, f"Moved to: {area_name}", (50, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

                
                # Start timing when the first valid move is detected
                if not start_time:
                    start_time = time.time()

                # Check for violations if the sequence is incorrect
                if len(current_sequence) > len(expected_sequence) or current_sequence != expected_sequence[:len(current_sequence)]:
                    violation_detected = True
                    current_sequence = []
                    violated_count += 1
                    print("Error: Violation detected! Press 'r' to reset.")
                    cv2.putText(frame, "Violation detected! Press 'r' to reset.", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                    
                    sop_violation = True
                    update_mongodb(sop_violation)
                    break

                # Check if sequence completed correctly
                if check_sequence(current_sequence, expected_sequence):
                    cycle_completed = True
                    completed_count += 1
                    print("Sequence completed successfully! Waiting 3 seconds...")
                    cv2.putText(frame, "Cycle completed!", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                
                    sop_violation = False
                    update_mongodb(sop_violation)
                    current_sequence = []
                    last_cycle_time = time.time()
                    yet_to_complete_count = max(target_count - completed_count - violated_count, 0)
                    start_time = None
                    time.sleep(3) 

                     # Check if target count is reached
                    if completed_count >= target_count:
                        print("Target count reached. Process complete.")
                        cap.release()
                        cv2.destroyAllWindows()
                        break

        # Display the frame with updates
        cv2.imshow("Hand Tracking", frame)

     # Key events
        key = cv2.waitKey(1)
        if key == ord("q"):  # Quit
            break
        elif key in range(ord("1"), ord("1") + num_working_areas):  # Set Working Areas
            area_index = key - ord("1")
            global selected_area
            selected_area = f"Working Area {area_index + 1}"
            print(f"Selected {selected_area} for area selection.")
        elif key == ord("m"):  # Set Main Area
            selected_area = "Main Area"
            print("Selected Main Area for area selection.")
        elif key == ord("r"):  # Reset violation state
            violation_detected = False
            current_sequence = []
            start_time = None
            print("Sequence reset.")
        
    cap.release()
    cv2.destroyAllWindows()
    hands.close()

@app.after_request
def apply_csp(response):
    csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    response.headers['Content-Security-Policy'] = csp
    return response

# Define route for streaming video
@app.route('/video_feed')
def video_feed():
    return Response(generate_video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/update-areas', methods=['POST'])
def update_areas():
    global working_areas, main_area

    # Initialize working_areas to ensure a fixed size of 2
    working_areas = [None, None]
    main_area = None

    # Parse JSON payload
    data = request.get_json()

    if not data or 'areas' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    try:
        areas = data['areas']

        for area in areas:
            area_name = area['area']
            coordinates = area['coordinates']

            # Round and convert start and end coordinates
            start = {
                "x": round(coordinates['start']['x']),
                "y": round(coordinates['start']['y'])
            }
            end = {
                "x": round(coordinates['end']['x']),
                "y": round(coordinates['end']['y'])
            }

            if area_name == "working1":
                # Store in working_areas[0]
                working_areas[0] = (start['x'], start['y']), (end['x'], end['y'])
                print(f"Updated Working Area 1: Start {start}, End {end}")
            elif area_name == "working2":
                # Store in working_areas[1]
                working_areas[1] = (start['x'], start['y']), (end['x'], end['y'])
                print(f"Updated Working Area 2: Start {start}, End {end}")
            elif area_name == "main":
                # Store in main_area
                main_area = (start['x'], start['y']), (end['x'], end['y'])
                print(f"Updated Main Area: Start {start}, End {end}")

        # Ensure all required areas are updated
        print(f"Final Working Areas: {working_areas}")
        print(f"Final Main Area: {main_area}")

        return jsonify({"message": "Areas updated successfully!"}), 200

    except KeyError as e:
        return jsonify({"error": f"Missing key in payload: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/keypress', methods=['POST'])
def key_input():
    global violation_detected, current_sequence, start_time, completed_count, violated_count, yet_to_complete_count, target_count
     # Get the data from the POST request
    data = request.get_json()
    
    if not data or 'key' not in data:
        return jsonify({"error": "Missing 'key' in request"}), 400

    key = data['key']  # The key that was pressed
    
    # Handle different keys and update the state accordingly
    if key == 'r':  # Reset the violation state
        violation_detected = False
        current_sequence = []
        start_time = None
        print("Sequence reset.")
        return jsonify({"message": "Violation state reset successfully."}), 200
    
    elif key == 'q':  # Quit or terminate the process (can be used for cleanup)
        print("Terminating process...")
        completed_count = 0
        violated_count = 0
        yet_to_complete_count = target_count
        return jsonify({"message": "Process terminated and counts reset."}), 200
     
     # Add other keys or logic as needed
    return jsonify({"error": "Invalid key pressed."}), 400

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            num_items_to_send = len(current_sequence) // 2 
            yield f"data: {json.dumps(num_items_to_send)}\n\n"
            time.sleep(1)  # Adjust as needed for your update frequency

    return Response(stream_with_context(event_stream()), content_type='text/event-stream')

threads = threading.Thread(target=stream)
threads.daemon=True
threads.start()

thread = threading.Thread(target=process)
thread.daemon = True
thread.start()
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

