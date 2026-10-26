import sys
import os

# Guarantee venv site-packages and project root are at head of sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
venv_site = os.path.join(root_dir, "backend", "venv", "Lib", "site-packages")
if os.path.exists(venv_site) and venv_site not in sys.path:
    sys.path.insert(0, venv_site)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("  SMART SOLARGUARD: Launching FastAPI Backend on 127.0.0.1:8000")
    print("=" * 60)
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)
