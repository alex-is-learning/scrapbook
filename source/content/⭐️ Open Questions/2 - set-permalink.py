import os
import argparse
import re

def generate_permalink_for_md_files(directory):
    """
    Scans a directory and its subdirectories for .md files. If a file
    lacks a permalink or has an empty one, it generates a permalink from 
    the filename and adds/updates it in the YAML frontmatter.

    The generated permalink is the filename in lowercase with spaces
    replaced by hyphens.

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
            if not filename.endswith(".md"):
                continue

            filepath = os.path.join(root, filename)
            
            # Generate the permalink value from the filename
            # e.g., "My File Name.md" -> "my-file-name"
            base_name = os.path.splitext(filename)[0]
            permalink_value = base_name.lower().replace(' ', '-')
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Case 1: No frontmatter. Create it.
                if not content.startswith("---"):
                    new_content = f"---\npermalink: {permalink_value}\n---\n\n{content}"
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✅ Created frontmatter and added permalink '{permalink_value}' to: {filepath}")
                    modified_files_count += 1
                    continue

                # Case 2: Frontmatter exists.
                end_frontmatter_index = content.find("---", 3)
                if end_frontmatter_index == -1:
                    print(f"⏭️  Skipped (malformed frontmatter): {filepath}")
                    skipped_files_count += 1
                    continue
                
                frontmatter_str = content[3:end_frontmatter_index]
                body_content = content[end_frontmatter_index+4:]

                # Check if permalink exists and has a non-empty value.
                # The regex \S+ looks for one or more non-whitespace characters.
                if re.search(r"permalink:\s*\S+", frontmatter_str):
                    print(f"⏭️  Skipped (permalink exists with value): {filepath}")
                    skipped_files_count += 1
                    continue
                
                # If we reach here, the permalink is either missing or empty.
                
                new_frontmatter_str = ""
                # If permalink key exists (but is empty), replace it.
                if "permalink:" in frontmatter_str:
                    # Use regex to replace the entire line containing 'permalink:'
                    new_frontmatter_str = re.sub(
                        r"permalink:.*",  # Target the whole line
                        f"permalink: {permalink_value}",  # Replace it
                        frontmatter_str
                    )
                    print(f"✅ Updated empty permalink to '{permalink_value}' in: {filepath}")
                # If permalink key doesn't exist at all, add it.
                else:
                    new_frontmatter_str = frontmatter_str.strip() + f"\npermalink: {permalink_value}\n"
                    print(f"✅ Added permalink '{permalink_value}' to: {filepath}")
                
                # Reconstruct and write the file
                new_content = f"---\n{new_frontmatter_str.strip()}\n---\n{body_content}"
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
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
    # To scan the current directory and all its subfolders:
    # > python permalink.py
    #
    # To scan a specific directory:
    # > python permalink.py /path/to/your/notes
    
    parser = argparse.ArgumentParser(
        description="Generates and adds a 'permalink:' to the frontmatter of .md files."
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
        generate_permalink_for_md_files(args.directory)
