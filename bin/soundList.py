import os
import sys
import json

def get_files_as_json(folder_path, output_file="./public/soundboard.json"):
    """
    Scans folder_path and writes a JSON array of files with web paths to output_file.

    Args:
        folder_path (str): The path to the folder to scan.
        output_file (str): The name of the output JSON file.
    """
    file_data = []
    if not os.path.isdir(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    # Normalize web base so files are referenced like /assets/sounds/filename.ext
    web_base = folder_path
    if web_base.startswith("./"):
        web_base = web_base[2:]
    if not web_base.startswith("/"):
        web_base = "/" + web_base
    if not web_base.endswith("/"):
        web_base += "/"

    for root, _, files in os.walk(folder_path):
        for file_name in files:
            full_path = os.path.join(root, file_name)
            file_info = {
                'name': os.path.splitext(file_name)[0],
                'file': web_base + file_name
            }
            file_data.append(file_info)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, 'w') as f:
        json.dump(file_data, f, indent=2)

    print(f"File list saved to '{output_file}'")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_files_as_json(sys.argv[1])
    else:
        # default: look in ./assets/sounds/
        get_files_as_json("./assets/sounds/")