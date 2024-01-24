import argparse
import os
import random
import re
import shutil
import sys

def clear_directory(directory):
    """
    Remove all files and directories in the specified directory.
    """
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)
    print(f"Cleared everything in {directory}")

def copy_items(src, dst, items):
    """
    Copy specified items from src to dst.
    items: List of directories and files to copy.
    """
    for item in items:
        src_path = os.path.join(src, item)
        dst_path = os.path.join(dst, item)

        # Check if the source path exists
        if os.path.exists(src_path):
            # Copy directories
            if os.path.isdir(src_path):
                shutil.copytree(src_path, dst_path)
            # Copy file
            elif os.path.isfile(src_path):
                shutil.copy2(src_path, dst_path)
            print(f"Copied {item} to {dst}")
        else:
            print(f"Item not found: {src_path}")

def init(current_path, target_path):
    # Ensure the target directory exists
    if not os.path.exists(target_path):
        os.makedirs(target_path)
    else:
        clear_directory(target_path)

    # List of directories and file to copy
    items_to_copy = [
        "SeaCarp.Application",
        "SeaCarp.CrossCutting",
        "SeaCarp.Domain",
        "SeaCarp.Infrastructure",
        "SeaCarp.Presentation",
        "SeaCarp.sln"
    ]

    # Copy the specified items
    copy_items(current_path, target_path, items_to_copy)

    print("Copying selected items complete.")

def find_vulnerabilities(directory):
    """
    Find and return a set of distinct placeholders in .cs and .cshtml files within the given directory.
    """
    placeholder_pattern = r'/// Start - (.+?) ///'
    placeholders = set()
    valid_extensions = ('.cs', '.cshtml')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(valid_extensions):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        match = re.search(placeholder_pattern, line)
                        if match:
                            placeholders.add(match.group(1))

    return placeholders

def parse_args(args, vulnerabilities):
    # Initialize parser
    parser = argparse.ArgumentParser(description='Process command line arguments.')

    # Add arguments
    parser.add_argument('-type', action='append', dest='types', help='Type of the placeholder.')
    parser.add_argument('-n', action='append', type=int, help='Number of items.')
    parser.add_argument('-p', action='append', type=int, help='Percentage (1-100).')

    # Parse arguments
    parsed_args = parser.parse_args(args)

    # Validate and organize arguments
    if not parsed_args.types or (not parsed_args.n and not parsed_args.p):
        parser.error('Each -type must be followed by either -n or -p.')

    organized_args = []
    is_n_mode = bool(parsed_args.n)

    for index, t in enumerate(parsed_args.types):
        if t not in vulnerabilities:
            parser.error(f'Invalid placeholder type: {t}. Must be one of {vulnerabilities}.')

        if is_n_mode:
            try:
                n_value = parsed_args.n[index]
                if n_value <= 0:
                    parser.error('Number must be greater than 0.')
                mode_value = ('number', n_value)
            except IndexError:
                parser.error('Each -type must be followed by a corresponding -n value.')
        else:
            try:
                p_value = parsed_args.p[index]
                if p_value < 1 or p_value > 100:
                    parser.error('Percentage must be between 1 and 100.')
                mode_value = ('percentage', p_value)
            except IndexError:
                parser.error('Each -type must be followed by a corresponding -p value.')

        organized_args.append((t, mode_value))

    return organized_args

def process_files(directory, vulnerabilities):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.cs') or file.endswith('.cshtml'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as file:
                    lines = file.readlines()

                inside_placeholder = False
                inside_option = False
                safe_option = []
                unsafe_options = []
                placeholder_name = ""
                new_lines = []

                for line in lines:
                    if '/// Start - ' in line:
                        inside_placeholder = True
                        placeholder_name = re.search(r'/// Start - (.+) ///', line).group(1)
                    elif '/// Safe' in line and inside_placeholder:
                        inside_option = True
                    elif '/// Unsafe - Option ' in line and inside_placeholder:
                        unsafe_options.append([])
                    elif '/// End - ' in line and inside_placeholder:
                        inside_placeholder = False
                        inside_option = False
                    elif inside_option and len(unsafe_options) == 0:
                        safe_option.append(line.replace('/// ', ''))
                    elif inside_option and len(unsafe_options) > 0:
                        unsafe_options[-1].append(line.replace('/// ', ''))
                    elif not inside_placeholder:
                        new_lines.append(line)
                    
                    if not inside_placeholder and len(safe_option) > 0:
                        if placeholder_name in list(map(lambda x: x[0], organized_args)):
                            # TODO: Doesn't care about the numbers the user passed in
                            for line in random.choice(unsafe_options):
                                new_lines.append(line)
                        else:
                            for line in safe_option:
                                new_lines.append(line)

                        safe_option = []
                        unsafe_options = []
                        placeholder_name = ""

                with open(file_path, 'w') as file:
                    file.writelines(new_lines)

if __name__ == "__main__":
    # Get the current working directory
    current_path = os.getcwd()

    # Name of the target folder
    folder_name = "TestApplication"
    target_path = os.path.join(current_path, folder_name)

    init(current_path, target_path)

    vulnerabilities = sorted(list(find_vulnerabilities(target_path)))
    print()

    args = sys.argv[1:]
    try:
        organized_args = parse_args(args, vulnerabilities)
        print("Parsed arguments:", organized_args)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    
    process_files(target_path, organized_args)


