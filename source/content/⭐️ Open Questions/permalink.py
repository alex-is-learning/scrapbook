import os
import argparse

def add_permalink_to_md_files(directory):
    """
    Scans a directory and its subdirectories for .md files and adds a 
    'permalink: ' entry to the YAML frontmatter if it doesn't already exist.

    Args:
        directory (str): The path to the directory to scan.
    """
    # os.walk will traverse the given directory and all of its subdirectories
    print(f"Scanning directory and all subdirectories: {os.path.abspath(directory)}\n")
    modified_files_count = 0
    skipped_files_count = 0

    # Walk through the directory and its subdirectories
    for root, _, files in os.walk(directory):
        for filename in files:
            if filename.endswith(".md"):
                filepath = os.path.join(root, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Check for YAML frontmatter (starts and ends with ---)
                    if content.startswith("---"):
                        # Find the end of the frontmatter
                        end_frontmatter_index = content.find("---", 3)
                        if end_frontmatter_index != -1:
                            frontmatter_str = content[3:end_frontmatter_index]
                            
                            # Check if 'permalink:' already exists in the frontmatter
                            if "permalink:" not in frontmatter_str:
                                # Add 'permalink: ' to the frontmatter
                                new_frontmatter_str = frontmatter_str.strip() + "\npermalink: \n"
                                new_content = f"---\n{new_frontmatter_str}---\n{content[end_frontmatter_index+4:]}"

                                with open(filepath, 'w', encoding='utf-8') as f:
                                    f.write(new_content)
                                print(f"✅ Added permalink to: {filepath}")
                                modified_files_count += 1
                            else:
                                print(f"⏭️  Skipped (permalink exists): {filepath}")
                                skipped_files_count += 1
                        else:
                            # Frontmatter started but didn't end, treat as no frontmatter
                            print(f"⏭️  Skipped (malformed frontmatter): {filepath}")
                            skipped_files_count += 1
                    else:
                        # If no frontmatter exists, create it
                        new_content = f"---\npermalink: \n---\n\n{content}"
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"✅ Created frontmatter and added permalink to: {filepath}")
                        modified_files_count += 1

                except Exception as e:
                    print(f"❌ Error processing file {filepath}: {e}")
                    skipped_files_count += 1
    
    print("\n----------------------------------------")
    print("          Processing Complete           ")
    print("----------------------------------------")
    print(f"Total files modified: {modified_files_count}")
    print(f"Total files skipped:  {skipped_files_count}")
    print("----------------------------------------")


if __name__ == "__main__":
    # --- How to Run ---
    # 1. Save this script (e.g., permalink.py).
    # 2. Open your terminal or command prompt.
    # 3. Navigate to the folder where you saved this script.
    #
    # To scan the current directory and all its subfolders (based on your screenshot):
    # > python permalink.py
    #
    # To scan a specific directory:
    # > python permalink.py /path/to/your/notes
    #
    # Example for Windows:
    # > python permalink.py "C:\\Users\\YourUser\\Documents\\ObsidianVault"
    #
    # Example for macOS/Linux:
    # > python permalink.py "/Users/youruser/Documents/ObsidianVault"
    
    parser = argparse.ArgumentParser(
        description="Adds a 'permalink:' to the frontmatter of .md files in a directory."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="The directory to scan. Defaults to the current directory if not provided."
    )
    args = parser.parse_args()

    if not os.path.isdir(args.directory):
        print(f"❌ Error: The specified directory does not exist: {args.directory}")
    else:
        add_permalink_to_md_files(args.directory)
