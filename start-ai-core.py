#!/usr/bin/env python3
"""
YaadFlex AI Core Startup Script
This runs your autonomous AI core alongside the main YaadFlex system
"""

import subprocess
import sys
import os

def main():
    print("🔥 Starting YaadFlex Autonomous AI Core...")
    
    # Change to server directory
    server_dir = os.path.join(os.path.dirname(__file__), "server")
    
    try:
        # Run the AI core
        subprocess.run([
            sys.executable, "yaad-ai-core.py"
        ], cwd=server_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 YaadFlex AI Core stopped by user")
    except Exception as e:
        print(f"❌ Error starting AI Core: {e}")

if __name__ == "__main__":
    main()