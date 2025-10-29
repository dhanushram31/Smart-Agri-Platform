#!/usr/bin/env python3
"""
Email Alert System for Animal Detection
======================================

This module provides Gmail-based email alert functionality for the animal
detection system. It sends notifications with detection frames when animals
are detected in farm monitoring systems.

Features:
- Gmail SMTP integration
- HTML email templates
- Image attachment support
- Environment variable configuration
- Priority-based alert customization
- Rate limiting to prevent spam

Author: Climate-Smart Agriculture Platform Team
Date: 2025
"""

import os
import cv2
import smtplib
import logging
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.utils import formataddr
import tempfile
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailAlert:
    """Gmail-based Email Alert System for Animal Detection"""
    
    def __init__(self):
        """Initialize the Email Alert System."""
        
        # Email configuration from environment variables
        self.smtp_server = 'smtp.gmail.com'
        self.smtp_port = 587
        self.email_user = os.environ.get('EMAIL_USER', '')
        self.email_password = os.environ.get('EMAIL_PASS', '')
        self.from_name = os.environ.get('FROM_NAME', 'Farm Animal Detection System')
        
        # Default recipient (can be overridden)
        self.default_recipient = os.environ.get('ALERT_EMAIL', self.email_user)
        
        # Rate limiting configuration
        self.rate_limit_file = 'email_rate_limit.json'
        self.max_emails_per_hour = 10  # Maximum emails per hour
        self.min_interval_minutes = 5  # Minimum interval between similar alerts
        
        # Alert templates based on priority
        self.alert_templates = {
            'CRITICAL': {
                'subject_prefix': '🚨 CRITICAL ALERT',
                'color': '#FF0000',
                'priority_text': 'IMMEDIATE ACTION REQUIRED'
            },
            'HIGH': {
                'subject_prefix': '⚠️ HIGH PRIORITY',
                'color': '#FF6600',
                'priority_text': 'HIGH PRIORITY DETECTION'
            },
            'MEDIUM': {
                'subject_prefix': '⚡ MEDIUM ALERT',
                'color': '#FFCC00',
                'priority_text': 'MEDIUM PRIORITY DETECTION'
            },
            'LOW': {
                'subject_prefix': '📢 NOTIFICATION',
                'color': '#00CC00',
                'priority_text': 'ROUTINE DETECTION'
            }
        }
        
        # Initialize rate limiting
        self._load_rate_limit_data()
    
    def test_configuration(self):
        """Test if email configuration is properly set up."""
        if not self.email_user or not self.email_password:
            logger.warning("Email configuration incomplete. Set EMAIL_USER and EMAIL_PASS environment variables.")
            return False
        
        try:
            # Test SMTP connection
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            server.quit()
            logger.info("✅ Email configuration test successful")
            return True
            
        except Exception as e:
            logger.error(f"❌ Email configuration test failed: {str(e)}")
            return False
    
    def _load_rate_limit_data(self):
        """Load rate limiting data from file."""
        try:
            if os.path.exists(self.rate_limit_file):
                with open(self.rate_limit_file, 'r') as f:
                    self.rate_limit_data = json.load(f)
            else:
                self.rate_limit_data = {
                    'email_history': [],
                    'last_alerts': {}
                }
        except Exception as e:
            logger.error(f"Error loading rate limit data: {str(e)}")
            self.rate_limit_data = {
                'email_history': [],
                'last_alerts': {}
            }
    
    def _save_rate_limit_data(self):
        """Save rate limiting data to file."""
        try:
            with open(self.rate_limit_file, 'w') as f:
                json.dump(self.rate_limit_data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving rate limit data: {str(e)}")
    
    def _check_rate_limit(self, animals):
        """
        Check if email should be sent based on rate limiting rules.
        
        Args:
            animals (list): List of detected animal names
            
        Returns:
            bool: True if email should be sent, False otherwise
        """
        now = datetime.now()
        current_hour = now.replace(minute=0, second=0, microsecond=0)
        
        # Clean old email history (older than 1 hour)
        self.rate_limit_data['email_history'] = [
            timestamp for timestamp in self.rate_limit_data['email_history']
            if datetime.fromisoformat(timestamp) > now - timedelta(hours=1)
        ]
        
        # Check hourly limit
        if len(self.rate_limit_data['email_history']) >= self.max_emails_per_hour:
            logger.warning(f"Rate limit exceeded: {len(self.rate_limit_data['email_history'])} emails in the last hour")
            return False
        
        # Check minimum interval for similar alerts
        animals_key = '_'.join(sorted(animals))
        last_alert_time = self.rate_limit_data['last_alerts'].get(animals_key)
        
        if last_alert_time:
            last_time = datetime.fromisoformat(last_alert_time)
            if now - last_time < timedelta(minutes=self.min_interval_minutes):
                logger.info(f"Skipping alert for {animals_key} - too recent (within {self.min_interval_minutes} minutes)")
                return False
        
        return True
    
    def _update_rate_limit_data(self, animals):
        """Update rate limiting data after sending email."""
        now = datetime.now()
        
        # Add to email history
        self.rate_limit_data['email_history'].append(now.isoformat())
        
        # Update last alert time for this animal combination
        animals_key = '_'.join(sorted(animals))
        self.rate_limit_data['last_alerts'][animals_key] = now.isoformat()
        
        # Save updated data
        self._save_rate_limit_data()
    
    def _get_highest_priority(self, animals):
        """
        Get the highest priority level from a list of animals.
        
        Args:
            animals (list): List of animal names
            
        Returns:
            str: Highest priority level
        """
        # Import priority mapping from detection module
        try:
            from detection import AnimalDetector
            priority_map = AnimalDetector().ANIMAL_PRIORITY
        except:
            # Fallback priority mapping
            priority_map = {
                'elephant': 'CRITICAL',
                'wild_boar': 'HIGH',
                'nilgai': 'HIGH',
                'bear': 'HIGH',
                'monkey': 'MEDIUM',
                'deer': 'MEDIUM',
                'pig': 'MEDIUM'
            }
        
        priority_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        highest_priority = 'LOW'
        
        for animal in animals:
            animal_priority = priority_map.get(animal, 'LOW')
            if priority_levels.index(animal_priority) > priority_levels.index(highest_priority):
                highest_priority = animal_priority
        
        return highest_priority
    
    def _create_html_email(self, animals, detection_time, is_live=False, priority='MEDIUM'):
        """
        Create HTML email content for animal detection alert.
        
        Args:
            animals (list): List of detected animal names
            detection_time (str): Detection timestamp
            is_live (bool): Whether this is from live stream
            priority (str): Alert priority level
            
        Returns:
            str: HTML email content
        """
        template_config = self.alert_templates.get(priority, self.alert_templates['MEDIUM'])
        
        # Animal list with emojis
        animal_emojis = {
            'elephant': '🐘',
            'cow': '🐄',
            'buffalo': '🐃',
            'goat': '🐐',
            'sheep': '🐑',
            'pig': '🐷',
            'dog': '🐕',
            'cat': '🐱',
            'monkey': '🐒',
            'deer': '🦌',
            'wild_boar': '🐗',
            'nilgai': '🦌',
            'peacock': '🦚',
            'bird': '🐦',
            'bear': '🐻'
        }
        
        animal_list_html = ""
        for animal in animals:
            emoji = animal_emojis.get(animal, '🐾')
            animal_list_html += f"<li style='margin: 5px 0; font-size: 16px;'>{emoji} <strong>{animal.title()}</strong></li>"
        
        detection_type = "Live Stream" if is_live else "Video Processing"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Animal Detection Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, {template_config['color']}, #666); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🚜 Farm Animal Detection Alert</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">{template_config['priority_text']}</p>
            </div>
            
            <!-- Content -->
            <div style="background: #f9f9f9; padding: 20px; border: 1px solid #ddd;">
                
                <!-- Alert Info -->
                <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid {template_config['color']};">
                    <h2 style="margin: 0 0 10px 0; color: {template_config['color']}; font-size: 18px;">Detection Summary</h2>
                    <p style="margin: 5px 0;"><strong>Detection Type:</strong> {detection_type}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> {detection_time}</p>
                    <p style="margin: 5px 0;"><strong>Animals Detected:</strong> {len(animals)}</p>
                    <p style="margin: 5px 0;"><strong>Priority Level:</strong> <span style="color: {template_config['color']}; font-weight: bold;">{priority}</span></p>
                </div>
                
                <!-- Animal List -->
                <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🐾 Detected Animals:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        {animal_list_html}
                    </ul>
                </div>
                
                <!-- Action Required -->
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">⚡ Recommended Actions:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #856404;">
        """
        
        # Add priority-specific recommendations
        if priority == 'CRITICAL':
            html_content += """
                        <li>🚨 <strong>Immediate action required</strong> - Check farm perimeter immediately</li>
                        <li>📞 Contact security/farm personnel</li>
                        <li>🚪 Secure livestock and crops</li>
                        <li>🔍 Monitor the area continuously</li>
            """
        elif priority == 'HIGH':
            html_content += """
                        <li>⚠️ <strong>High priority</strong> - Investigate within 30 minutes</li>
                        <li>🔍 Check affected farm areas</li>
                        <li>🛡️ Implement deterrent measures if needed</li>
                        <li>📝 Document the incident</li>
            """
        elif priority == 'MEDIUM':
            html_content += """
                        <li>📋 Review detection details</li>
                        <li>🔍 Monitor the area for further activity</li>
                        <li>📊 Update farm monitoring logs</li>
                        <li>🛠️ Consider preventive measures</li>
            """
        else:  # LOW
            html_content += """
                        <li>📝 Note the detection for records</li>
                        <li>📊 Update monitoring statistics</li>
                        <li>🔍 Routine area check recommended</li>
            """
        
        html_content += """
                    </ul>
                </div>
                
                <!-- Detection Image -->
                <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📸 Detection Frame:</h3>
                    <p style="margin: 0; color: #666; font-style: italic;">Detection frame is attached to this email</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px;">
                <p style="margin: 0;">🚜 Climate-Smart Agriculture Platform</p>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">Automated Farm Animal Detection System</p>
                <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
                    This is an automated alert. Please do not reply to this email.
                </p>
            </div>
            
        </body>
        </html>
        """
        
        return html_content
    
    def send_detection_alert(self, animals, detection_frame=None, recipient=None, is_live=False):
        """
        Send email alert for animal detection.
        
        Args:
            animals (list): List of detected animal names
            detection_frame (numpy.ndarray): Detection frame to attach
            recipient (str): Email recipient (optional)
            is_live (bool): Whether this is from live stream
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if not self.email_user or not self.email_password:
            logger.warning("Email not configured. Skipping alert.")
            return False
        
        # Check rate limiting
        if not self._check_rate_limit(animals):
            return False
        
        try:
            # Determine priority and recipient
            priority = self._get_highest_priority(animals)
            recipient = recipient or self.default_recipient
            
            if not recipient:
                logger.error("No recipient email address available")
                return False
            
            # Create email
            msg = MIMEMultipart('related')
            template_config = self.alert_templates.get(priority, self.alert_templates['MEDIUM'])
            
            # Email headers
            msg['From'] = formataddr((self.from_name, self.email_user))
            msg['To'] = recipient
            msg['Subject'] = f"{template_config['subject_prefix']}: {', '.join(animals)} detected on farm"
            
            # Create HTML content
            detection_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            html_content = self._create_html_email(animals, detection_time, is_live, priority)
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Attach detection frame if provided
            if detection_frame is not None:
                try:
                    # Convert frame to JPEG
                    _, buffer = cv2.imencode('.jpg', detection_frame)
                    
                    # Create image attachment
                    image = MIMEImage(buffer.tobytes())
                    image.add_header('Content-Disposition', 'attachment', filename='detection_frame.jpg')
                    image.add_header('Content-ID', '<detection_frame>')
                    msg.attach(image)
                    
                except Exception as e:
                    logger.error(f"Error attaching detection frame: {str(e)}")
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            
            text = msg.as_string()
            server.sendmail(self.email_user, recipient, text)
            server.quit()
            
            # Update rate limiting
            self._update_rate_limit_data(animals)
            
            logger.info(f"✅ Alert email sent successfully to {recipient} for {len(animals)} animals ({priority} priority)")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error sending alert email: {str(e)}")
            return False
    
    def send_test_email(self, recipient=None):
        """
        Send a test email to verify configuration.
        
        Args:
            recipient (str): Test email recipient
            
        Returns:
            bool: True if test email sent successfully
        """
        recipient = recipient or self.default_recipient
        
        if not recipient:
            logger.error("No recipient email address for test")
            return False
        
        # Create test detection
        test_animals = ['cow', 'goat']
        test_frame = None  # No frame for test
        
        logger.info(f"Sending test email to {recipient}...")
        success = self.send_detection_alert(
            animals=test_animals,
            detection_frame=test_frame,
            recipient=recipient,
            is_live=False
        )
        
        if success:
            logger.info("✅ Test email sent successfully!")
        else:
            logger.error("❌ Test email failed")
        
        return success
    
    def get_email_statistics(self):
        """
        Get email alert statistics.
        
        Returns:
            dict: Email statistics
        """
        try:
            # Load current rate limit data
            self._load_rate_limit_data()
            
            now = datetime.now()
            
            # Count emails in last 24 hours
            emails_24h = [
                timestamp for timestamp in self.rate_limit_data['email_history']
                if datetime.fromisoformat(timestamp) > now - timedelta(hours=24)
            ]
            
            # Count emails in last hour
            emails_1h = [
                timestamp for timestamp in self.rate_limit_data['email_history']
                if datetime.fromisoformat(timestamp) > now - timedelta(hours=1)
            ]
            
            return {
                'total_emails_sent': len(self.rate_limit_data['email_history']),
                'emails_last_24h': len(emails_24h),
                'emails_last_hour': len(emails_1h),
                'rate_limit_max_per_hour': self.max_emails_per_hour,
                'min_interval_minutes': self.min_interval_minutes,
                'last_alerts': self.rate_limit_data['last_alerts']
            }
            
        except Exception as e:
            logger.error(f"Error getting email statistics: {str(e)}")
            return {}

# =============================================================================
# CONFIGURATION FUNCTIONS
# =============================================================================

def setup_email_config(email_user, email_password, alert_email=None, from_name=None):
    """
    Setup email configuration programmatically.
    
    Args:
        email_user (str): Gmail username
        email_password (str): Gmail app password
        alert_email (str): Default alert recipient
        from_name (str): Display name for sender
    """
    os.environ['EMAIL_USER'] = email_user
    os.environ['EMAIL_PASS'] = email_password
    
    if alert_email:
        os.environ['ALERT_EMAIL'] = alert_email
    
    if from_name:
        os.environ['FROM_NAME'] = from_name
    
    logger.info("✅ Email configuration updated")

# =============================================================================
# TESTING AND DEBUGGING
# =============================================================================

def test_email_system():
    """Test the email alert system."""
    print("📧 Testing Email Alert System...")
    
    email_alert = EmailAlert()
    
    print(f"✅ Configuration test: {email_alert.test_configuration()}")
    print(f"✅ Rate limiting initialized")
    
    # Test with sample detection
    if email_alert.email_user and email_alert.email_password:
        print("🧪 Sending test email...")
        success = email_alert.send_test_email()
        print(f"✅ Test email result: {success}")
    else:
        print("⚠️ Email credentials not configured - skipping test email")
    
    print("🎉 Email system test completed!")

if __name__ == "__main__":
    test_email_system()
