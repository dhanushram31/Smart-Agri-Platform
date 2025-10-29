#!/usr/bin/env python3
"""
Training Dataset Preparation Script for YOLOv8 Animal Detection
============================================================

This script prepares and trains YOLOv8 models with custom animal datasets
specifically designed for Indian farm animal detection. It supports various
annotation formats including LabelImg and Roboflow.

Features:
- Dataset preparation and validation
- Multiple annotation format support
- YOLOv8 training with custom configurations
- Model evaluation and export
- Integration with existing detection system

Author: Climate-Smart Agriculture Platform Team  
Date: 2025
"""

import os
import sys
import yaml
import json
import shutil
import logging
from pathlib import Path
from datetime import datetime
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from ultralytics import YOLO
import xml.etree.ElementTree as ET

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatasetPreparator:
    """Prepare and validate datasets for YOLOv8 training"""
    
    def __init__(self, dataset_path, output_path="prepared_dataset"):
        """
        Initialize the dataset preparator.
        
        Args:
            dataset_path (str): Path to raw dataset
            output_path (str): Path for prepared dataset
        """
        self.dataset_path = Path(dataset_path)
        self.output_path = Path(output_path)
        
        # Indian farm animal classes (matches detection.py)
        self.animal_classes = {
            0: 'wild_boar',      # High priority pest
            1: 'nilgai',         # High priority pest  
            2: 'elephant',       # Critical priority pest
            3: 'monkey',         # Medium priority pest
            4: 'deer',           # Medium priority pest
            5: 'peacock',        # Protected bird
            6: 'porcupine',      # Small pest
            7: 'jackal_fox',     # Predator
            8: 'bird',           # General birds
            9: 'rodent',         # Small pests
            10: 'stray_cattle',  # Domestic animals
            11: 'domestic_animal' # Other domestic animals
        }
        
        # Create output directories
        self._create_directories()
    
    def _create_directories(self):
        """Create necessary directories for dataset preparation."""
        directories = [
            self.output_path,
            self.output_path / "images" / "train",
            self.output_path / "images" / "val", 
            self.output_path / "images" / "test",
            self.output_path / "labels" / "train",
            self.output_path / "labels" / "val",
            self.output_path / "labels" / "test",
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            
        logger.info(f"Created dataset directories in {self.output_path}")
    
    def prepare_from_labelimg(self, images_path, annotations_path):
        """
        Prepare dataset from LabelImg annotations (XML format).
        
        Args:
            images_path (str): Path to images directory
            annotations_path (str): Path to XML annotations directory
            
        Returns:
            bool: Success status
        """
        try:
            images_path = Path(images_path)
            annotations_path = Path(annotations_path)
            
            logger.info("Processing LabelImg dataset...")
            
            # Get all image files
            image_files = []
            for ext in ['.jpg', '.jpeg', '.png', '.bmp']:
                image_files.extend(list(images_path.glob(f"*{ext}")))
                image_files.extend(list(images_path.glob(f"*{ext.upper()}")))
            
            processed_count = 0
            
            for image_file in image_files:
                # Find corresponding XML file
                xml_file = annotations_path / f"{image_file.stem}.xml"
                
                if not xml_file.exists():
                    logger.warning(f"No annotation found for {image_file.name}")
                    continue
                
                # Parse XML annotation
                annotations = self._parse_labelimg_xml(xml_file, image_file)
                
                if annotations:
                    # Convert to YOLO format
                    yolo_annotations = self._convert_to_yolo_format(annotations, image_file)
                    
                    if yolo_annotations:
                        # Save image and annotation
                        self._save_prepared_sample(image_file, yolo_annotations, 'train')
                        processed_count += 1
            
            logger.info(f"Processed {processed_count} samples from LabelImg dataset")
            return processed_count > 0
            
        except Exception as e:
            logger.error(f"Error processing LabelImg dataset: {str(e)}")
            return False
    
    def prepare_from_roboflow(self, dataset_path):
        """
        Prepare dataset from Roboflow export.
        
        Args:
            dataset_path (str): Path to Roboflow dataset directory
            
        Returns:
            bool: Success status
        """
        try:
            dataset_path = Path(dataset_path)
            logger.info("Processing Roboflow dataset...")
            
            # Look for data.yaml file
            yaml_file = dataset_path / "data.yaml"
            if not yaml_file.exists():
                logger.error("No data.yaml found in Roboflow dataset")
                return False
            
            # Load Roboflow configuration
            with open(yaml_file, 'r') as f:
                roboflow_config = yaml.safe_load(f)
            
            # Map Roboflow classes to our classes
            class_mapping = self._create_class_mapping(roboflow_config.get('names', []))
            
            # Process train, val, test splits
            splits = ['train', 'valid', 'test']
            processed_count = 0
            
            for split in splits:
                split_path = dataset_path / split
                if not split_path.exists():
                    continue
                
                images_path = split_path / "images"
                labels_path = split_path / "labels"
                
                if not images_path.exists() or not labels_path.exists():
                    continue
                
                # Process images in this split
                for image_file in images_path.glob("*.*"):
                    if image_file.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.bmp']:
                        continue
                    
                    label_file = labels_path / f"{image_file.stem}.txt"
                    
                    if label_file.exists():
                        # Read YOLO annotations
                        annotations = self._read_yolo_annotations(label_file, class_mapping)
                        
                        if annotations:
                            # Save to our dataset structure
                            target_split = 'val' if split == 'valid' else split
                            self._save_prepared_sample(image_file, annotations, target_split)
                            processed_count += 1
            
            logger.info(f"Processed {processed_count} samples from Roboflow dataset")
            return processed_count > 0
            
        except Exception as e:
            logger.error(f"Error processing Roboflow dataset: {str(e)}")
            return False
    
    def _parse_labelimg_xml(self, xml_file, image_file):
        """Parse LabelImg XML annotation file."""
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            
            # Get image dimensions
            size = root.find('size')
            img_width = int(size.find('width').text)
            img_height = int(size.find('height').text)
            
            annotations = []
            
            # Parse each object
            for obj in root.findall('object'):
                class_name = obj.find('name').text.lower()
                
                # Map class name to our classes
                class_id = self._map_class_name(class_name)
                if class_id is None:
                    continue
                
                # Get bounding box
                bbox = obj.find('bndbox')
                xmin = int(bbox.find('xmin').text)
                ymin = int(bbox.find('ymin').text)
                xmax = int(bbox.find('xmax').text)
                ymax = int(bbox.find('ymax').text)
                
                annotations.append({
                    'class_id': class_id,
                    'class_name': self.animal_classes[class_id],
                    'bbox': [xmin, ymin, xmax, ymax],
                    'img_width': img_width,
                    'img_height': img_height
                })
            
            return annotations
            
        except Exception as e:
            logger.error(f"Error parsing XML file {xml_file}: {str(e)}")
            return []
    
    def _convert_to_yolo_format(self, annotations, image_file):
        """Convert annotations to YOLO format."""
        try:
            if not annotations:
                return []
            
            yolo_annotations = []
            
            for ann in annotations:
                # Get image dimensions
                img_width = ann['img_width']
                img_height = ann['img_height']
                
                # Convert bbox to YOLO format (normalized center coordinates + width/height)
                xmin, ymin, xmax, ymax = ann['bbox']
                
                center_x = (xmin + xmax) / 2.0 / img_width
                center_y = (ymin + ymax) / 2.0 / img_height
                width = (xmax - xmin) / img_width
                height = (ymax - ymin) / img_height
                
                # Ensure values are within bounds
                center_x = max(0, min(1, center_x))
                center_y = max(0, min(1, center_y))
                width = max(0, min(1, width))
                height = max(0, min(1, height))
                
                yolo_annotations.append({
                    'class_id': ann['class_id'],
                    'center_x': center_x,
                    'center_y': center_y,
                    'width': width,
                    'height': height
                })
            
            return yolo_annotations
            
        except Exception as e:
            logger.error(f"Error converting to YOLO format: {str(e)}")
            return []
    
    def _map_class_name(self, class_name):
        """Map class name to our class ID."""
        # Mapping common names to our class IDs
        name_mappings = {
            'wild boar': 0, 'wildboar': 0, 'boar': 0,
            'nilgai': 1, 'blue bull': 1, 'bluebull': 1,
            'elephant': 2,
            'monkey': 3, 'langur': 3, 'macaque': 3,
            'deer': 4, 'chital': 4, 'spotted deer': 4,
            'peacock': 5, 'peafowl': 5,
            'porcupine': 6,
            'jackal': 7, 'fox': 7, 'jackal_fox': 7,
            'bird': 8, 'birds': 8,
            'rodent': 9, 'rat': 9, 'mouse': 9,
            'cattle': 10, 'cow': 10, 'bull': 10, 'stray_cattle': 10,
            'domestic': 11, 'domestic_animal': 11, 'goat': 11, 'sheep': 11
        }
        
        class_name = class_name.lower().strip()
        
        for name, class_id in name_mappings.items():
            if class_name in name or name in class_name:
                return class_id
        
        logger.warning(f"Unknown class name: {class_name}")
        return None
    
    def _create_class_mapping(self, roboflow_classes):
        """Create mapping from Roboflow classes to our classes."""
        mapping = {}
        
        for i, class_name in enumerate(roboflow_classes):
            our_class_id = self._map_class_name(class_name)
            if our_class_id is not None:
                mapping[i] = our_class_id
        
        return mapping
    
    def _read_yolo_annotations(self, label_file, class_mapping=None):
        """Read YOLO format annotations."""
        try:
            annotations = []
            
            with open(label_file, 'r') as f:
                lines = f.readlines()
            
            for line in lines:
                parts = line.strip().split()
                if len(parts) != 5:
                    continue
                
                class_id = int(parts[0])
                
                # Apply class mapping if provided
                if class_mapping and class_id in class_mapping:
                    class_id = class_mapping[class_id]
                elif class_mapping:
                    continue  # Skip unmapped classes
                
                center_x = float(parts[1])
                center_y = float(parts[2])
                width = float(parts[3])
                height = float(parts[4])
                
                annotations.append({
                    'class_id': class_id,
                    'center_x': center_x,
                    'center_y': center_y,
                    'width': width,
                    'height': height
                })
            
            return annotations
            
        except Exception as e:
            logger.error(f"Error reading YOLO annotations from {label_file}: {str(e)}")
            return []
    
    def _save_prepared_sample(self, image_file, annotations, split):
        """Save prepared image and annotations to dataset."""
        try:
            # Copy image
            target_image_path = self.output_path / "images" / split / image_file.name
            shutil.copy2(image_file, target_image_path)
            
            # Save YOLO annotations
            target_label_path = self.output_path / "labels" / split / f"{image_file.stem}.txt"
            
            with open(target_label_path, 'w') as f:
                for ann in annotations:
                    f.write(f"{ann['class_id']} {ann['center_x']:.6f} {ann['center_y']:.6f} "
                           f"{ann['width']:.6f} {ann['height']:.6f}\n")
            
        except Exception as e:
            logger.error(f"Error saving sample {image_file.name}: {str(e)}")
    
    def create_data_yaml(self):
        """Create data.yaml configuration file for training."""
        try:
            # Count samples in each split
            train_count = len(list((self.output_path / "images" / "train").glob("*.*")))
            val_count = len(list((self.output_path / "images" / "val").glob("*.*")))
            test_count = len(list((self.output_path / "images" / "test").glob("*.*")))
            
            # Create data.yaml content
            data_config = {
                'path': str(self.output_path.absolute()),
                'train': 'images/train',
                'val': 'images/val',
                'test': 'images/test',
                'nc': len(self.animal_classes),
                'names': self.animal_classes
            }
            
            # Save data.yaml
            yaml_path = self.output_path / "data.yaml"
            with open(yaml_path, 'w') as f:
                yaml.dump(data_config, f, default_flow_style=False)
            
            logger.info(f"Created data.yaml with {train_count} train, {val_count} val, {test_count} test samples")
            return str(yaml_path)
            
        except Exception as e:
            logger.error(f"Error creating data.yaml: {str(e)}")
            return None
    
    def validate_dataset(self):
        """Validate the prepared dataset."""
        try:
            logger.info("Validating prepared dataset...")
            
            issues = []
            
            # Check directory structure
            required_dirs = [
                "images/train", "images/val", "labels/train", "labels/val"
            ]
            
            for dir_path in required_dirs:
                full_path = self.output_path / dir_path
                if not full_path.exists():
                    issues.append(f"Missing directory: {dir_path}")
            
            # Check for images without labels and vice versa
            for split in ['train', 'val']:
                images_dir = self.output_path / "images" / split
                labels_dir = self.output_path / "labels" / split
                
                if not images_dir.exists() or not labels_dir.exists():
                    continue
                
                image_files = {f.stem for f in images_dir.glob("*.*")}
                label_files = {f.stem for f in labels_dir.glob("*.txt")}
                
                # Images without labels
                missing_labels = image_files - label_files
                if missing_labels:
                    issues.append(f"Images without labels in {split}: {len(missing_labels)}")
                
                # Labels without images
                missing_images = label_files - image_files
                if missing_images:
                    issues.append(f"Labels without images in {split}: {len(missing_images)}")
            
            # Check annotation format
            sample_label = None
            for split in ['train', 'val']:
                labels_dir = self.output_path / "labels" / split
                if labels_dir.exists():
                    label_files = list(labels_dir.glob("*.txt"))
                    if label_files:
                        sample_label = label_files[0]
                        break
            
            if sample_label:
                try:
                    with open(sample_label, 'r') as f:
                        lines = f.readlines()
                    
                    for line in lines:
                        parts = line.strip().split()
                        if len(parts) != 5:
                            issues.append(f"Invalid annotation format in {sample_label.name}")
                            break
                        
                        # Check class ID range
                        class_id = int(parts[0])
                        if class_id not in self.animal_classes:
                            issues.append(f"Invalid class ID {class_id} in {sample_label.name}")
                        
                        # Check coordinate ranges
                        coords = [float(x) for x in parts[1:]]
                        if any(x < 0 or x > 1 for x in coords):
                            issues.append(f"Coordinates out of range in {sample_label.name}")
                            break
                            
                except Exception as e:
                    issues.append(f"Error reading annotation {sample_label.name}: {str(e)}")
            
            # Report validation results
            if issues:
                logger.warning(f"Dataset validation found {len(issues)} issues:")
                for issue in issues:
                    logger.warning(f"  - {issue}")
                return False
            else:
                logger.info("✅ Dataset validation passed!")
                return True
                
        except Exception as e:
            logger.error(f"Error during dataset validation: {str(e)}")
            return False

class AnimalModelTrainer:
    """Train YOLOv8 models for animal detection"""
    
    def __init__(self, data_yaml_path, models_dir="models"):
        """
        Initialize the model trainer.
        
        Args:
            data_yaml_path (str): Path to data.yaml file
            models_dir (str): Directory to save trained models
        """
        self.data_yaml_path = data_yaml_path
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(exist_ok=True)
        
        # Training configurations
        self.training_configs = {
            'nano': {
                'model': 'yolov8n.pt',
                'epochs': 100,
                'batch': 16,
                'imgsz': 640,
                'lr0': 0.01
            },
            'small': {
                'model': 'yolov8s.pt', 
                'epochs': 150,
                'batch': 8,
                'imgsz': 640,
                'lr0': 0.01
            },
            'medium': {
                'model': 'yolov8m.pt',
                'epochs': 200,
                'batch': 4,
                'imgsz': 640,
                'lr0': 0.01
            }
        }
    
    def train_model(self, model_size='nano', custom_config=None):
        """
        Train a YOLOv8 model.
        
        Args:
            model_size (str): Model size (nano, small, medium)
            custom_config (dict): Custom training configuration
            
        Returns:
            str: Path to trained model
        """
        try:
            logger.info(f"Starting training for {model_size} model...")
            
            # Get training configuration
            if custom_config:
                config = custom_config
            else:
                config = self.training_configs.get(model_size, self.training_configs['nano'])
            
            # Initialize model
            model = YOLO(config['model'])
            
            # Set up training parameters
            train_params = {
                'data': self.data_yaml_path,
                'epochs': config['epochs'],
                'batch': config['batch'],
                'imgsz': config['imgsz'],
                'lr0': config['lr0'],
                'project': str(self.models_dir),
                'name': f'animal_detection_{model_size}_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
                'save_period': 10,
                'patience': 50,
                'plots': True,
                'verbose': True,
                
                # Data augmentation for farm environments
                'hsv_h': 0.015,
                'hsv_s': 0.7,
                'hsv_v': 0.4,
                'degrees': 15,
                'translate': 0.1,
                'scale': 0.2,
                'shear': 0.0,
                'perspective': 0.0,
                'flipud': 0.0,
                'fliplr': 0.5,
                'mosaic': 0.8,
                'mixup': 0.1,
                'copy_paste': 0.1,
                
                # Optimization
                'optimizer': 'AdamW',
                'weight_decay': 0.0005,
                'warmup_epochs': 3,
                'warmup_momentum': 0.8,
                'warmup_bias_lr': 0.1,
            }
            
            # Start training
            results = model.train(**train_params)
            
            # Get best model path
            best_model_path = results.save_dir / 'weights' / 'best.pt'
            
            if best_model_path.exists():
                logger.info(f"✅ Training completed! Best model saved at: {best_model_path}")
                
                # Copy to models directory with standard name
                standard_path = self.models_dir / f"animal_detection_{model_size}_best.pt"
                shutil.copy2(best_model_path, standard_path)
                
                return str(standard_path)
            else:
                logger.error("Training completed but best model not found")
                return None
                
        except Exception as e:
            logger.error(f"Error during training: {str(e)}")
            return None
    
    def evaluate_model(self, model_path):
        """
        Evaluate a trained model.
        
        Args:
            model_path (str): Path to trained model
            
        Returns:
            dict: Evaluation results
        """
        try:
            logger.info(f"Evaluating model: {model_path}")
            
            # Load model
            model = YOLO(model_path)
            
            # Run validation
            results = model.val(data=self.data_yaml_path, plots=True)
            
            # Extract metrics
            if hasattr(results, 'box'):
                metrics = {
                    'mAP50': float(results.box.map50),
                    'mAP50_95': float(results.box.map),
                    'precision': float(results.box.mp),
                    'recall': float(results.box.mr)
                }
                
                logger.info(f"Evaluation Results:")
                logger.info(f"  mAP50: {metrics['mAP50']:.3f}")
                logger.info(f"  mAP50-95: {metrics['mAP50_95']:.3f}")
                logger.info(f"  Precision: {metrics['precision']:.3f}")
                logger.info(f"  Recall: {metrics['recall']:.3f}")
                
                return metrics
            else:
                logger.error("Could not extract evaluation metrics")
                return {}
                
        except Exception as e:
            logger.error(f"Error during evaluation: {str(e)}")
            return {}
    
    def export_model(self, model_path, formats=['onnx']):
        """
        Export trained model to different formats.
        
        Args:
            model_path (str): Path to trained model  
            formats (list): Export formats
            
        Returns:
            dict: Exported model paths
        """
        try:
            logger.info(f"Exporting model to formats: {formats}")
            
            # Load model
            model = YOLO(model_path)
            
            exported_paths = {}
            
            for format_name in formats:
                try:
                    if format_name == 'onnx':
                        export_path = model.export(format='onnx', imgsz=640, optimize=True)
                        exported_paths['onnx'] = export_path
                        
                    elif format_name == 'tensorrt':
                        export_path = model.export(format='engine', imgsz=640, half=True)
                        exported_paths['tensorrt'] = export_path
                        
                    elif format_name == 'openvino':
                        export_path = model.export(format='openvino', imgsz=640, half=True)
                        exported_paths['openvino'] = export_path
                        
                    logger.info(f"✅ Exported {format_name}: {export_path}")
                    
                except Exception as e:
                    logger.error(f"Failed to export {format_name}: {str(e)}")
            
            return exported_paths
            
        except Exception as e:
            logger.error(f"Error during model export: {str(e)}")
            return {}

# =============================================================================
# MAIN FUNCTIONS
# =============================================================================

def main():
    """Main function for dataset preparation and training."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Prepare and train YOLOv8 animal detection models')
    parser.add_argument('--mode', choices=['prepare', 'train', 'evaluate'], required=True,
                       help='Operation mode')
    parser.add_argument('--dataset-path', help='Path to raw dataset')
    parser.add_argument('--dataset-type', choices=['labelimg', 'roboflow'], 
                       help='Dataset format type')
    parser.add_argument('--images-path', help='Path to images (for LabelImg)')
    parser.add_argument('--annotations-path', help='Path to annotations (for LabelImg)')
    parser.add_argument('--output-path', default='prepared_dataset', 
                       help='Output path for prepared dataset')
    parser.add_argument('--model-size', choices=['nano', 'small', 'medium'], default='nano',
                       help='Model size for training')
    parser.add_argument('--model-path', help='Path to trained model (for evaluation)')
    
    args = parser.parse_args()
    
    if args.mode == 'prepare':
        if not args.dataset_path:
            print("Error: --dataset-path is required for prepare mode")
            return
        
        # Prepare dataset
        preparator = DatasetPreparator(args.dataset_path, args.output_path)
        
        success = False
        if args.dataset_type == 'labelimg':
            if not args.images_path or not args.annotations_path:
                print("Error: --images-path and --annotations-path required for LabelImg format")
                return
            success = preparator.prepare_from_labelimg(args.images_path, args.annotations_path)
            
        elif args.dataset_type == 'roboflow':
            success = preparator.prepare_from_roboflow(args.dataset_path)
            
        else:
            print("Error: --dataset-type is required for prepare mode")
            return
        
        if success:
            # Create data.yaml
            yaml_path = preparator.create_data_yaml()
            if yaml_path:
                print(f"✅ Dataset prepared successfully!")
                print(f"📁 Dataset path: {args.output_path}")
                print(f"📄 Data config: {yaml_path}")
                
                # Validate dataset
                if preparator.validate_dataset():
                    print("✅ Dataset validation passed!")
                else:
                    print("⚠️ Dataset validation found issues")
            else:
                print("❌ Failed to create data.yaml")
        else:
            print("❌ Dataset preparation failed")
    
    elif args.mode == 'train':
        # Find data.yaml file
        data_yaml = None
        if args.dataset_path:
            data_yaml = Path(args.dataset_path) / "data.yaml"
        elif Path(args.output_path).exists():
            data_yaml = Path(args.output_path) / "data.yaml"
        
        if not data_yaml or not data_yaml.exists():
            print("Error: Could not find data.yaml file")
            return
        
        # Train model
        trainer = AnimalModelTrainer(str(data_yaml))
        model_path = trainer.train_model(args.model_size)
        
        if model_path:
            print(f"✅ Training completed!")
            print(f"🤖 Model saved: {model_path}")
            
            # Evaluate model
            metrics = trainer.evaluate_model(model_path)
            if metrics:
                print("📊 Evaluation metrics:")
                for metric, value in metrics.items():
                    print(f"  {metric}: {value:.3f}")
            
            # Export model
            exported = trainer.export_model(model_path, ['onnx'])
            if exported:
                print("📤 Exported formats:")
                for format_name, path in exported.items():
                    print(f"  {format_name}: {path}")
        else:
            print("❌ Training failed")
    
    elif args.mode == 'evaluate':
        if not args.model_path:
            print("Error: --model-path is required for evaluate mode")
            return
        
        # Find data.yaml file
        data_yaml = None
        if args.dataset_path:
            data_yaml = Path(args.dataset_path) / "data.yaml"
        elif Path(args.output_path).exists():
            data_yaml = Path(args.output_path) / "data.yaml"
        
        if not data_yaml or not data_yaml.exists():
            print("Error: Could not find data.yaml file")
            return
        
        # Evaluate model
        trainer = AnimalModelTrainer(str(data_yaml))
        metrics = trainer.evaluate_model(args.model_path)
        
        if metrics:
            print("📊 Evaluation Results:")
            for metric, value in metrics.items():
                print(f"  {metric}: {value:.3f}")
        else:
            print("❌ Evaluation failed")

if __name__ == "__main__":
    main()
