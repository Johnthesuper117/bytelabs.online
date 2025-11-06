import os
import sys
import yaml

def get_files_as_yaml(folder_path, output_file="./_data/soundboard.yml"):
    """
    Scans a specified folder, collects information about its files,
    and saves it to a YAML file.

    Args:
        folder_path (str): The path to the folder to scan.
        output_file (str): The name of the output YAML file.
    """
    file_data = []
    if not os.path.isdir(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    for root, _, files in os.walk(folder_path):
        for file_name in files:
            full_path = os.path.join(root, file_name)
            file_info = {
                'name': file_name[:-len(os.path.splitext(file_name)[1])],
                'file': folder_path + file_name
            }
            file_data.append(file_info)

    with open(output_file, 'w') as f:
        yaml.dump(file_data, f, default_flow_style=False)

    print(f"File list saved to '{output_file}'")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_files_as_yaml(sys.argv[1])
        
    else:
        print("Sounds Folder not defined.")