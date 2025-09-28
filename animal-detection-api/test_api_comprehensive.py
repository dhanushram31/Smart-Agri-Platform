#!/usr/bin/env python3
"""
Animal Detection API Test Script
===============================

This script provides comprehensive testing for the Animal Detection API,
including all endpoints, functionality, and system health checks.

Usage:
    python3 test_api_comprehensive.py [--host HOST] [--port PORT]

Features:
- Health check endpoint testing
- Video upload API testing  
- Live stream API testing
- Statistics endpoint testing
- Error handling validation
- Performance benchmarking
"""

import requests
import json
import time
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path
import urllib3

# Disable SSL warnings for testing
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class AnimalDetectionAPITester:
    """Comprehensive API tester for Animal Detection system"""
    
    def __init__(self, base_url="http://localhost:5000"):
        """Initialize the API tester.
        
        Args:
            base_url (str): Base URL of the API server
        """
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.test_results = []
        
        print(f"🧪 Animal Detection API Tester")
        print(f"🌐 Testing server: {self.base_url}")
        print("=" * 50)
    
    def log_test(self, test_name, success, message="", response_time=None):
        """Log test result."""
        status = "✅ PASS" if success else "❌ FAIL" 
        timing = f" ({response_time:.2f}s)" if response_time else ""
        
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'response_time': response_time,
            'timestamp': datetime.now().isoformat()
        }
        
        self.test_results.append(result)
        print(f"{status} {test_name}{timing}")
        if message:
            print(f"    {message}")
    
    def test_server_connection(self):
        """Test basic server connectivity."""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/", timeout=10)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                self.log_test("Server Connection", True, 
                            f"Status: {response.status_code}", response_time)
                return True
            else:
                self.log_test("Server Connection", False, 
                            f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Server Connection", False, f"Error: {str(e)}")
            return False
    
    def test_health_endpoint(self):
        """Test health check endpoint."""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/health", timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy':
                    self.log_test("Health Endpoint", True, 
                                f"System healthy", response_time)
                    return True
                else:
                    self.log_test("Health Endpoint", False, 
                                f"Status: {data.get('status', 'unknown')}")
                    return False
            else:
                self.log_test("Health Endpoint", False, 
                            f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Health Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_detection_statistics(self):
        """Test detection statistics endpoint."""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/detection_statistics", timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_detections', 'animals_detected', 'detection_history']
                
                if all(field in data for field in required_fields):
                    self.log_test("Detection Statistics", True, 
                                f"Found {data['total_detections']} total detections", response_time)
                    return True
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Detection Statistics", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("Detection Statistics", False, 
                            f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Detection Statistics", False, f"Error: {str(e)}")
            return False
    
    def test_video_upload_api(self):
        """Test video upload API (without actual file)."""
        try:
            start_time = time.time()
            # Test without file (should return error)
            response = self.session.post(f"{self.base_url}/api/upload_video", timeout=10)
            response_time = time.time() - start_time
            
            # Should return 400 for missing file
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    self.log_test("Video Upload API (No File)", True, 
                                "Correctly rejected empty request", response_time)
                    return True
                else:
                    self.log_test("Video Upload API (No File)", False, 
                                "Missing error message")
                    return False
            else:
                self.log_test("Video Upload API (No File)", False, 
                            f"Unexpected status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Video Upload API (No File)", False, f"Error: {str(e)}")
            return False
    
    def test_live_stream_api(self):
        """Test live stream API endpoints."""
        try:
            # Test start live stream (should fail without RTSP URL)
            start_time = time.time()
            response = self.session.post(f"{self.base_url}/api/start_live_stream", 
                                       json={}, timeout=5)
            response_time = time.time() - start_time
            
            # Should return 400 for missing RTSP URL
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    self.log_test("Live Stream API (No URL)", True, 
                                "Correctly rejected empty request", response_time)
                else:
                    self.log_test("Live Stream API (No URL)", False, 
                                "Missing error message")
                    return False
            else:
                self.log_test("Live Stream API (No URL)", False, 
                            f"Unexpected status: {response.status_code}")
                return False
            
            # Test with invalid RTSP URL
            start_time = time.time()
            response = self.session.post(f"{self.base_url}/api/start_live_stream", 
                                       json={"rtsp_url": "invalid_url"}, timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code in [400, 500]:
                self.log_test("Live Stream API (Invalid URL)", True, 
                            "Correctly handled invalid URL", response_time)
                return True
            else:
                self.log_test("Live Stream API (Invalid URL)", False, 
                            f"Unexpected status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Live Stream API", False, f"Error: {str(e)}")
            return False
    
    def test_web_pages(self):
        """Test web page accessibility."""
        pages = {
            'Main Page': '/',
            'Upload Page': '/upload',
            'Live Stream Page': '/live',
            'Results Page': '/results'
        }
        
        all_passed = True
        
        for page_name, endpoint in pages.items():
            try:
                start_time = time.time()
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=5)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    # Check if it's HTML content
                    if 'text/html' in response.headers.get('content-type', ''):
                        self.log_test(f"Web Page - {page_name}", True, 
                                    "Page loaded successfully", response_time)
                    else:
                        self.log_test(f"Web Page - {page_name}", False, 
                                    "Not HTML content")
                        all_passed = False
                else:
                    self.log_test(f"Web Page - {page_name}", False, 
                                f"HTTP {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Web Page - {page_name}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_cors_headers(self):
        """Test CORS headers for API endpoints."""
        try:
            # Test OPTIONS request
            start_time = time.time()
            response = self.session.options(f"{self.base_url}/api/health", timeout=5)
            response_time = time.time() - start_time
            
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            found_headers = [h for h in cors_headers if h in response.headers]
            
            if len(found_headers) >= 1:  # At least one CORS header
                self.log_test("CORS Headers", True, 
                            f"Found {len(found_headers)} CORS headers", response_time)
                return True
            else:
                self.log_test("CORS Headers", False, 
                            "No CORS headers found")
                return False
                
        except Exception as e:
            self.log_test("CORS Headers", False, f"Error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for invalid requests."""
        try:
            # Test invalid endpoint
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/nonexistent", timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code == 404:
                self.log_test("Error Handling - 404", True, 
                            "Correctly returned 404 for invalid endpoint", response_time)
                return True
            else:
                self.log_test("Error Handling - 404", False, 
                            f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Error Handling - 404", False, f"Error: {str(e)}")
            return False
    
    def test_performance_benchmarks(self):
        """Run basic performance benchmarks."""
        try:
            # Test multiple health check requests
            times = []
            for i in range(5):
                start_time = time.time()
                response = self.session.get(f"{self.base_url}/api/health", timeout=5)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    times.append(response_time)
                else:
                    break
            
            if len(times) == 5:
                avg_time = sum(times) / len(times)
                max_time = max(times)
                min_time = min(times)
                
                # Performance criteria: average < 1s, max < 2s
                if avg_time < 1.0 and max_time < 2.0:
                    self.log_test("Performance Benchmark", True, 
                                f"Avg: {avg_time:.3f}s, Max: {max_time:.3f}s, Min: {min_time:.3f}s")
                    return True
                else:
                    self.log_test("Performance Benchmark", False, 
                                f"Slow response - Avg: {avg_time:.3f}s")
                    return False
            else:
                self.log_test("Performance Benchmark", False, 
                            "Could not complete all requests")
                return False
                
        except Exception as e:
            self.log_test("Performance Benchmark", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests."""
        print("\n🚀 Starting comprehensive API tests...\n")
        
        test_functions = [
            self.test_server_connection,
            self.test_health_endpoint,
            self.test_detection_statistics,
            self.test_video_upload_api,
            self.test_live_stream_api,
            self.test_web_pages,
            self.test_cors_headers,
            self.test_error_handling,
            self.test_performance_benchmarks
        ]
        
        passed = 0
        total = 0
        
        for test_func in test_functions:
            try:
                result = test_func()
                if result:
                    passed += 1
                total += 1
            except Exception as e:
                print(f"❌ Test {test_func.__name__} crashed: {str(e)}")
                total += 1
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"🏁 Test Summary: {passed}/{total} tests passed")
        print(f"📊 Success rate: {(passed/total*100):.1f}%" if total > 0 else "No tests run")
        
        if passed == total:
            print("🎉 All tests passed! API is ready for use.")
        elif passed > total * 0.8:
            print("⚠️ Most tests passed, but some issues found.")
        else:
            print("❌ Multiple test failures. Please check the API.")
        
        return passed, total
    
    def generate_test_report(self):
        """Generate detailed test report."""
        if not self.test_results:
            return "No test results to report."
        
        report = f"""
# Animal Detection API Test Report

**Test Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Server:** {self.base_url}
**Total Tests:** {len(self.test_results)}

## Test Results

| Test | Status | Response Time | Message |
|------|--------|---------------|---------|
"""
        
        for result in self.test_results:
            status = "✅ PASS" if result['success'] else "❌ FAIL"
            time_str = f"{result['response_time']:.3f}s" if result['response_time'] else "N/A"
            message = result['message'][:50] + "..." if len(result['message']) > 50 else result['message']
            
            report += f"| {result['test']} | {status} | {time_str} | {message} |\n"
        
        # Summary statistics
        passed = sum(1 for r in self.test_results if r['success'])
        total = len(self.test_results)
        success_rate = (passed / total * 100) if total > 0 else 0
        
        report += f"""
## Summary

- **Passed:** {passed}/{total}
- **Success Rate:** {success_rate:.1f}%
- **Average Response Time:** {sum(r['response_time'] for r in self.test_results if r['response_time']) / len([r for r in self.test_results if r['response_time']]):.3f}s

## Recommendations

"""
        
        if success_rate == 100:
            report += "🎉 All tests passed! The API is functioning correctly."
        elif success_rate >= 80:
            report += "⚠️ Most tests passed, but some minor issues were found. Review failed tests."
        else:
            report += "❌ Multiple test failures detected. The API needs attention before deployment."
        
        return report

def main():
    """Main function."""
    parser = argparse.ArgumentParser(description='Test Animal Detection API')
    parser.add_argument('--host', default='localhost', help='API host')
    parser.add_argument('--port', default='5000', help='API port')
    parser.add_argument('--report', action='store_true', help='Generate detailed report')
    
    args = parser.parse_args()
    
    base_url = f"http://{args.host}:{args.port}"
    
    # Initialize tester
    tester = AnimalDetectionAPITester(base_url)
    
    # Run tests
    passed, total = tester.run_all_tests()
    
    # Generate report if requested
    if args.report:
        report = tester.generate_test_report()
        report_file = f"api_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        with open(report_file, 'w') as f:
            f.write(report)
        
        print(f"\n📄 Detailed report saved to: {report_file}")
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
