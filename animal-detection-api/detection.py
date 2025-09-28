#!/usr/bin/env python3
"""
Enhanced Animal Detection Module using YOLOv8
============================================

This module provides comprehensive animal detection capabilities specifically
designed for Indian farm monitoring. It includes YOLOv8 integration with
customizable animal classes and confidence thresholds.

Features:
- YOLOv8 model integration
- Indian farm animal detection (12+ species)
- Configurable confidence threshold (default: 0.6)
- Video and frame processing
- Real-time detection capabilities
- Detection visualization with bounding boxes

Author: Climate-Smart Agriculture Platform Team
Date: 2025
"""

import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnimalDetector:
    """Enhanced Animal Detection System using YOLOv8"""
    
    def __init__(self, model_path='models/yolov8n.pt', confidence_threshold=0.6):
        """
        Initialize the Animal Detector with YOLOv8 model.
        
        Args:
            model_path (str): Path to YOLOv8 model file
            confidence_threshold (float): Minimum confidence for detections (default: 0.6)
        """
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.model = None
        
        # Indian Farm Animal Classes Configuration
        # These are the animals commonly found in Indian farms that can cause crop damage
        self.INDIAN_FARM_ANIMALS = {
            # COCO dataset class IDs mapped to Indian farm animals
            15: 'cat',              # Farm cats (pest control)
            16: 'dog',              # Farm dogs / stray dogs
            17: 'horse',            # Farm horses
            18: 'sheep',            # Sheep farming
            19: 'cow',              # Dairy cows, cattle
            20: 'elephant',         # Wild elephants (major crop threat)
            21: 'bear',             # Bears (crop raiding)
            22: 'zebra',            # (if trained on extended dataset)
            23: 'giraffe',          # (if trained on extended dataset)
            
            # Additional classes for specialized models
            24: 'buffalo',          # Water buffalo (common in Indian farms)
            25: 'goat',             # Goat farming
            26: 'pig',              # Pig farming
            27: 'monkey',           # Monkeys (major crop pest)
            28: 'wild_boar',        # Wild boars (significant crop damage)
            29: 'nilgai',           # Nilgai (blue bull - crop pest)
            30: 'deer',             # Various deer species
            31: 'peacock',          # Peacocks (national bird, crop impact)
            32: 'bird'              # General birds (crop pests)
        }
        
        # Priority levels for different animals (for alert system)
        self.ANIMAL_PRIORITY = {
            'elephant': 'CRITICAL',     # Massive damage, human safety risk
            'wild_boar': 'HIGH',        # Aggressive, significant crop damage
            'nilgai': 'HIGH',           # Large herbivore, major crop losses
            'monkey': 'MEDIUM',         # Intelligent, persistent crop raiding
            'bear': 'HIGH',             # Safety risk, crop damage
            'deer': 'MEDIUM',           # Moderate crop damage
            'stray_dog': 'MEDIUM',      # Livestock threat
            'cow': 'LOW',               # Usually managed, but can stray
            'buffalo': 'LOW',           # Usually managed
            'goat': 'LOW',              # Usually managed
            'sheep': 'LOW',             # Usually managed
            'pig': 'MEDIUM',            # Can become feral
            'peacock': 'LOW',           # Protected species, minor impact
            'bird': 'LOW',              # Individual birds, minor impact
            'cat': 'LOW',               # Beneficial for pest control
            'dog': 'LOW'                # Farm dogs are beneficial
        }
        
        # Color scheme for bounding boxes based on priority
        self.PRIORITY_COLORS = {
            'CRITICAL': (0, 0, 255),    # Red
            'HIGH': (0, 165, 255),      # Orange
            'MEDIUM': (0, 255, 255),    # Yellow
            'LOW': (0, 255, 0)          # Green
        }
        
        # Load the model
        self._load_model()
    
    def _load_model(self):
        """Load the YOLOv8 model."""
        try:
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # If specific model doesn't exist, download YOLOv8n
            if not os.path.exists(self.model_path):
                logger.info(f"Model not found at {self.model_path}. Downloading YOLOv8n...")
                self.model_path = 'yolov8n.pt'  # This will auto-download
            
            self.model = YOLO(self.model_path)
            logger.info(f"✅ YOLOv8 model loaded successfully: {self.model_path}")
            
            # Set model parameters
            self.model.conf = self.confidence_threshold  # Confidence threshold
            self.model.iou = 0.5   # IoU threshold for NMS
            
        except Exception as e:
            logger.error(f"❌ Error loading model: {str(e)}")
            self.model = None
    
    def is_model_loaded(self):
        """Check if the model is successfully loaded."""
        return self.model is not None
    
    def get_supported_animals(self):
        """Get list of supported Indian farm animals."""
        return list(self.INDIAN_FARM_ANIMALS.values())
    
    def update_confidence_threshold(self, new_threshold):
        """Update the confidence threshold for detections."""
        self.confidence_threshold = new_threshold
        if self.model:
            self.model.conf = new_threshold
        logger.info(f"Updated confidence threshold to {new_threshold}")
    
    def detect_frame(self, frame):
        """
        Detect animals in a single frame.
        
        Args:
            frame (numpy.ndarray): Input frame/image
            
        Returns:
            list: List of detection dictionaries with animal info
        """
        if not self.is_model_loaded():
            logger.error("Model not loaded. Cannot perform detection.")
            return []
        
        try:
            # Run inference
            results = self.model(frame, verbose=False)
            
            detections = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Get detection info
                        class_id = int(box.cls.cpu().numpy()[0])
                        confidence = float(box.conf.cpu().numpy()[0])
                        bbox = box.xyxy.cpu().numpy()[0]  # x1, y1, x2, y2
                        
                        # Check if it's a farm animal and meets confidence threshold
                        if class_id in self.INDIAN_FARM_ANIMALS:
                            animal_name = self.INDIAN_FARM_ANIMALS[class_id]
                            
                            # Skip if confidence is below threshold
                            if confidence < self.confidence_threshold:
                                continue
                            
                            detection = {
                                'animal': animal_name,
                                'confidence': confidence,
                                'bbox': [int(x) for x in bbox],  # [x1, y1, x2, y2]
                                'class_id': class_id,
                                'priority': self.ANIMAL_PRIORITY.get(animal_name, 'LOW'),
                                'timestamp': datetime.now().isoformat()
                            }
                            
                            detections.append(detection)
            
            return detections
            
        except Exception as e:
            logger.error(f"Error in frame detection: {str(e)}")
            return []
    
    def process_video(self, input_path, output_path):
        """
        Process a video file and save the output with detections.
        
        Args:
            input_path (str): Path to input video file
            output_path (str): Path to save processed video
            
        Returns:
            list: All detections found in the video
        """
        return self.process_video_with_progress(input_path, output_path)

    def process_video_with_progress(self, input_path, output_path, video_id=None, progress_callback=None):
        """
        Process a video file with real-time progress tracking.
        
        Args:
            input_path (str): Path to input video file
            output_path (str): Path to save processed video
            video_id (str): Unique identifier for progress tracking
            progress_callback (callable): Function to call with progress updates
            
        Returns:
            list: All detections found in the video
        """
        if not self.is_model_loaded():
            logger.error("Model not loaded. Cannot process video.")
            return []
        
        try:
            # Open video
            cap = cv2.VideoCapture(input_path)
            
            if not cap.isOpened():
                logger.error(f"Failed to open video: {input_path}")
                return []
            
            # Get video properties
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Setup video writer
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            all_detections = []
            frame_count = 0
            start_time = datetime.now()
            
            logger.info(f"Processing video: {total_frames} frames at {fps} FPS")
            
            # Initialize progress tracking
            def update_progress():
                if video_id and progress_callback:
                    elapsed_time = (datetime.now() - start_time).total_seconds()
                    processing_fps = frame_count / elapsed_time if elapsed_time > 0 else 0
                    remaining_frames = total_frames - frame_count
                    estimated_remaining = remaining_frames / processing_fps if processing_fps > 0 else 0
                    
                    progress_data = {
                        'status': 'processing',
                        'progress_percentage': (frame_count / total_frames) * 100 if total_frames > 0 else 0,
                        'current_frame': frame_count,
                        'total_frames': total_frames,
                        'detections_so_far': len(all_detections),
                        'estimated_time_remaining': estimated_remaining,
                        'processing_fps': processing_fps,
                        'message': f'Processing frame {frame_count}/{total_frames}...',
                        'timestamp': datetime.now().isoformat()
                    }
                    progress_callback(video_id, progress_data)
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Detect animals in frame
                detections = self.detect_frame(frame)
                
                # Draw detections on frame
                if detections:
                    frame = self.draw_detections(frame, detections)
                    
                    # Add detections to overall list with frame info
                    for detection in detections:
                        detection['frame_number'] = frame_count
                        detection['timestamp_in_video'] = frame_count / fps
                        detection['timestamp'] = datetime.now().isoformat()
                    
                    all_detections.extend(detections)
                
                # Write frame
                out.write(frame)
                
                # Update progress more frequently for better real-time feedback
                if frame_count % max(1, total_frames // 100) == 0 or frame_count % 30 == 0:
                    update_progress()
                    progress = (frame_count / total_frames) * 100
                    logger.info(f"Processing progress: {progress:.1f}% ({frame_count}/{total_frames})")
            
            # Final progress update
            if video_id and progress_callback:
                final_progress = {
                    'status': 'completed',
                    'progress_percentage': 100,
                    'current_frame': frame_count,
                    'total_frames': total_frames,
                    'detections_so_far': len(all_detections),
                    'estimated_time_remaining': 0,
                    'processing_fps': frame_count / (datetime.now() - start_time).total_seconds(),
                    'message': f'Processing complete! Found {len(all_detections)} detections.',
                    'timestamp': datetime.now().isoformat()
                }
                progress_callback(video_id, final_progress)
            
            # Cleanup
            cap.release()
            out.release()
            
            logger.info(f"✅ Video processing complete: {len(all_detections)} total detections")
            return all_detections
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            
            # Update progress with error status
            if video_id and progress_callback:
                error_progress = {
                    'status': 'error',
                    'progress_percentage': 0,
                    'current_frame': frame_count,
                    'total_frames': total_frames,
                    'detections_so_far': len(all_detections),
                    'estimated_time_remaining': 0,
                    'processing_fps': 0,
                    'message': f'Error processing video: {str(e)}',
                    'timestamp': datetime.now().isoformat()
                }
                progress_callback(video_id, error_progress)
            
            return []
    
    def draw_detections(self, frame, detections):
        """
        Draw bounding boxes and labels on frame.
        
        Args:
            frame (numpy.ndarray): Input frame
            detections (list): List of detection dictionaries
            
        Returns:
            numpy.ndarray: Frame with drawn detections
        """
        try:
            for detection in detections:
                # Get detection info
                animal = detection['animal']
                confidence = detection['confidence']
                bbox = detection['bbox']
                priority = detection['priority']
                
                # Get color based on priority
                color = self.PRIORITY_COLORS.get(priority, (0, 255, 0))
                
                # Draw bounding box
                x1, y1, x2, y2 = bbox
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                # Prepare label
                label = f"{animal}: {confidence:.2f} ({priority})"
                
                # Calculate label size
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.6
                thickness = 2
                (label_width, label_height), _ = cv2.getTextSize(label, font, font_scale, thickness)
                
                # Draw label background
                cv2.rectangle(frame, 
                            (x1, y1 - label_height - 10), 
                            (x1 + label_width, y1), 
                            color, -1)
                
                # Draw label text
                cv2.putText(frame, label, (x1, y1 - 5), font, font_scale, (255, 255, 255), thickness)
            
            return frame
            
        except Exception as e:
            logger.error(f"Error drawing detections: {str(e)}")
            return frame
    
    def get_detection_frame(self, video_path, detection):
        """
        Extract a specific frame from video where detection occurred.
        
        Args:
            video_path (str): Path to video file
            detection (dict): Detection dictionary with frame info
            
        Returns:
            numpy.ndarray: Frame with detection, or None if error
        """
        try:
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                return None
            
            # Go to specific frame
            frame_number = detection.get('frame_number', 0)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
            
            ret, frame = cap.read()
            cap.release()
            
            if ret:
                # Draw the specific detection
                frame = self.draw_detections(frame, [detection])
                return frame
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting detection frame: {str(e)}")
            return None
    
    def create_placeholder_frame(self, message="No Stream"):
        """
        Create a placeholder frame for when no stream is available.
        
        Args:
            message (str): Message to display
            
        Returns:
            numpy.ndarray: Placeholder frame
        """
        # Create a black frame
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # Add text
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        color = (255, 255, 255)
        thickness = 2
        
        # Calculate text position (centered)
        text_size = cv2.getTextSize(message, font, font_scale, thickness)[0]
        text_x = (frame.shape[1] - text_size[0]) // 2
        text_y = (frame.shape[0] + text_size[1]) // 2
        
        cv2.putText(frame, message, (text_x, text_y), font, font_scale, color, thickness)
        
        return frame
    
    def get_detection_statistics(self, detections):
        """
        Generate statistics from detection results.
        
        Args:
            detections (list): List of detection dictionaries
            
        Returns:
            dict: Statistics dictionary
        """
        if not detections:
            return {
                'total_detections': 0,
                'unique_animals': [],
                'animal_counts': {},
                'priority_distribution': {},
                'average_confidence': 0.0
            }
        
        # Count animals
        animal_counts = {}
        priority_counts = {}
        confidences = []
        
        for detection in detections:
            animal = detection['animal']
            priority = detection['priority']
            confidence = detection['confidence']
            
            animal_counts[animal] = animal_counts.get(animal, 0) + 1
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
            confidences.append(confidence)
        
        return {
            'total_detections': len(detections),
            'unique_animals': list(animal_counts.keys()),
            'animal_counts': animal_counts,
            'priority_distribution': priority_counts,
            'average_confidence': sum(confidences) / len(confidences) if confidences else 0.0,
            'highest_confidence': max(confidences) if confidences else 0.0,
            'lowest_confidence': min(confidences) if confidences else 0.0
        }

# =============================================================================
# CONFIGURATION FUNCTIONS
# =============================================================================

def update_animal_config(new_animals=None, new_priorities=None):
    """
    Update the animal configuration dynamically.
    
    Args:
        new_animals (dict): New animal class mappings
        new_priorities (dict): New priority mappings
    """
    if new_animals:
        AnimalDetector.INDIAN_FARM_ANIMALS.update(new_animals)
        logger.info(f"Updated animal configuration with {len(new_animals)} new animals")
    
    if new_priorities:
        AnimalDetector.ANIMAL_PRIORITY.update(new_priorities)
        logger.info(f"Updated priority configuration for {len(new_priorities)} animals")

def load_custom_model(model_path, detector_instance):
    """
    Load a custom trained model.
    
    Args:
        model_path (str): Path to custom model
        detector_instance (AnimalDetector): Detector instance to update
    """
    if os.path.exists(model_path):
        detector_instance.model_path = model_path
        detector_instance._load_model()
        logger.info(f"Loaded custom model: {model_path}")
        return True
    else:
        logger.error(f"Custom model not found: {model_path}")
        return False

# =============================================================================
# TESTING AND DEBUGGING
# =============================================================================

def test_detection_system():
    """Test the detection system with a sample configuration."""
    print("🧪 Testing Animal Detection System...")
    
    detector = AnimalDetector()
    
    print(f"✅ Model loaded: {detector.is_model_loaded()}")
    print(f"✅ Supported animals: {len(detector.get_supported_animals())}")
    print(f"✅ Confidence threshold: {detector.confidence_threshold}")
    
    # Test with a sample frame
    test_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    detections = detector.detect_frame(test_frame)
    print(f"✅ Test detection completed: {len(detections)} animals found")
    
    print("🎉 Detection system test completed!")

if __name__ == "__main__":
    test_detection_system()
