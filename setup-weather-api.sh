#!/bin/bash

# Weather API Setup Helper Script
# This script helps you configure the OpenWeatherMap API key

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Weather API Setup Helper${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if API key is already set
if [ ! -z "$OPENWEATHER_API_KEY" ] && [ "$OPENWEATHER_API_KEY" != "your_api_key_here" ]; then
    echo -e "${GREEN}✅ OPENWEATHER_API_KEY is already configured!${NC}"
    echo -e "   Current key: ${OPENWEATHER_API_KEY:0:10}...${OPENWEATHER_API_KEY: -6}"
    echo ""
    read -p "Do you want to update it? (y/N): " update_key
    if [[ ! $update_key =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Keeping existing API key.${NC}"
        exit 0
    fi
fi

# Instructions
echo -e "${YELLOW}📝 You need an OpenWeatherMap API key to use weather auto-fill.${NC}"
echo ""
echo -e "${BLUE}Steps to get your API key:${NC}"
echo -e "  1. Go to: ${GREEN}https://openweathermap.org/api${NC}"
echo -e "  2. Click: ${GREEN}'Sign Up'${NC} (free tier is sufficient)"
echo -e "  3. Verify your email"
echo -e "  4. Get your API key from: ${GREEN}https://home.openweathermap.org/api_keys${NC}"
echo -e "  5. Copy the key and paste below"
echo ""
echo -e "${YELLOW}⚠️  Note: New API keys take 10-15 minutes to activate${NC}"
echo ""

# Get API key from user
read -p "Enter your OpenWeatherMap API key: " api_key

# Validate input
if [ -z "$api_key" ]; then
    echo -e "${RED}❌ No API key provided. Exiting.${NC}"
    exit 1
fi

if [ ${#api_key} -lt 20 ]; then
    echo -e "${RED}❌ API key seems too short. Please check and try again.${NC}"
    exit 1
fi

# Export for current session
export OPENWEATHER_API_KEY="$api_key"

# Detect shell
SHELL_CONFIG=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
    SHELL_NAME="bash"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
    SHELL_NAME="bash"
fi

echo ""
echo -e "${GREEN}✅ API key set for current session!${NC}"
echo ""

# Offer to save permanently
if [ ! -z "$SHELL_CONFIG" ]; then
    echo -e "${YELLOW}Would you like to save this API key permanently?${NC}"
    echo -e "   This will add it to: ${BLUE}${SHELL_CONFIG}${NC}"
    read -p "   Save permanently? (Y/n): " save_permanent
    
    if [[ ! $save_permanent =~ ^[Nn]$ ]]; then
        # Check if already exists
        if grep -q "OPENWEATHER_API_KEY" "$SHELL_CONFIG"; then
            # Update existing line
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|export OPENWEATHER_API_KEY=.*|export OPENWEATHER_API_KEY=\"$api_key\"|" "$SHELL_CONFIG"
            else
                # Linux
                sed -i "s|export OPENWEATHER_API_KEY=.*|export OPENWEATHER_API_KEY=\"$api_key\"|" "$SHELL_CONFIG"
            fi
            echo -e "${GREEN}✅ Updated existing API key in ${SHELL_CONFIG}${NC}"
        else
            # Add new line
            echo "" >> "$SHELL_CONFIG"
            echo "# OpenWeatherMap API Key for Smart-Agri-Platform" >> "$SHELL_CONFIG"
            echo "export OPENWEATHER_API_KEY=\"$api_key\"" >> "$SHELL_CONFIG"
            echo -e "${GREEN}✅ Added API key to ${SHELL_CONFIG}${NC}"
        fi
        
        echo ""
        echo -e "${BLUE}To activate in new terminals, run:${NC}"
        echo -e "   ${GREEN}source ${SHELL_CONFIG}${NC}"
    fi
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. ${BLUE}Start Flask API:${NC}"
echo -e "     cd crop-prediction-api"
echo -e "     source venv/bin/activate"
echo -e "     python app.py"
echo ""
echo -e "  2. ${BLUE}Test weather auto-fill:${NC}"
echo -e "     Open http://localhost:3000"
echo -e "     Click 'Get Weather Data' button"
echo ""
echo -e "${YELLOW}⚠️  Remember: Wait 10-15 minutes if you just created the API key!${NC}"
echo ""
