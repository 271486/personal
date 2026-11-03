import subprocess
import sys
import os
from pathlib import Path

# Base directory: directory where this launcher script resides
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

scripts = {
    "1": ("Messages Analyzer", "messages.py"),
    "2": ("Messages V2 Analyzer", "messagesv2.py"),
    "3": ("Response Time Analyzer", "Responcetime.py"),
    "4": ("Extra Script", "Script.py"),
    "5": ("Exit", None)
}

def run_script(file_name):
    path = os.path.join(BASE_DIR, file_name)

    try:
        print(f"\nRunning: {file_name}\n")
        subprocess.run([sys.executable, path], check=True)
        print(f"\nFinished: {file_name}")

    except subprocess.CalledProcessError as e:
        print(f"\nError running {file_name}: {e}")

    except FileNotFoundError:
        print(f"\nFile not found: {path}")

def menu():
    while True:
        print("\n" + "=" * 45)
        print("        LOG INFO SCRIPT LAUNCHER")
        print("=" * 45)

        for key, (name, _) in scripts.items():
            print(f"{key}. {name}")

        choice = input("\nSelect an option: ").strip()

        if choice in scripts:
            name, file = scripts[choice]

            if choice == "5":
                print("\nExiting launcher.")
                break

            run_script(file)
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    menu()
