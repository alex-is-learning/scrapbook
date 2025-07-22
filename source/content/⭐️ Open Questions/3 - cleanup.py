import os
import argparse
import re

def clean_existing_permalinks(directory):
    """
    Scans a directory for .md files and cleans up existing permalinks
    in the YAML frontmatter.

    Cleaning process:
    1. Removes any character that is not a lowercase letter, number, or hyphen.
    2. Collapses multiple consecutive hyphens into a single hyphen.
    3. Converts the permalink to lowercase.

    Args:
        directory (str): The path to the directory to scan.
    """
    print(f"Scanning directory and all subdirectories to clean permalinks: {os.path.abspath(directory)}\n")
    modified_files_count = 0
    skipped_files_count = 0

    for root, _, files in os.walk(directory):
        for filename in files:
            if not filename.endswith(".md"):
                continue

            filepath = os.path.join(root, filename)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # We only care about files that have frontmatter
                if not content.startswith("---"):
                    continue

                end_frontmatter_index = content.find("---", 3)
                if end_frontmatter_index == -1:
                    print(f"⏭️  Skipped (malformed frontmatter): {filepath}")
                    skipped_files_count += 1
                    continue
                
                frontmatter_str = content[3:end_frontmatter_index]
                
                # Try to find a permalink with a value
                match = re.search(r"permalink:\s*(\S+)", frontmatter_str)
                
                if not match:
                    # No permalink found, or it's empty. Nothing to clean.
                    skipped_files_count += 1
                    continue

                original_permalink = match.group(1)
                
                # --- Cleaning Logic ---
                # 1. Convert to lowercase.
                s = original_permalink.lower()
                # 2. Remove any character that is not a letter, number, or hyphen.
                s = re.sub(r'[^a-z0-9-]', '', s)
                # 3. Replace any sequence of hyphens with a single hyphen.
                s = re.sub(r'-+', '-', s)
                # 4. Remove any leading or trailing hyphens.
                cleaned_permalink = s.strip('-')

                # If the cleaning process changed the permalink, update the file.
                if original_permalink != cleaned_permalink:
                    # Replace the old permalink line with the new one
                    updated_frontmatter = re.sub(
                        r"permalink:\s*\S+",
                        f"permalink: {cleaned_permalink}",
                        frontmatter_str
                    )
                    
                    body_content = content[end_frontmatter_index:]
                    new_content = f"---{updated_frontmatter}{body_content}"
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✅ Cleaned permalink in: {filepath}")
                    print(f"   - From: {original_permalink}")
                    print(f"   - To:   {cleaned_permalink}")
                    modified_files_count += 1
                else:
                    print(f"⏭️  Skipped (already clean): {filepath}")
                    skipped_files_count += 1

            except Exception as e:
                print(f"❌ Error processing file {filepath}: {e}")
                skipped_files_count += 1
    
    print("\n----------------------------------------")
    print("          Cleaning Complete             ")
    print("----------------------------------------")
    print(f"Total files modified: {modified_files_count}")
    print(f"Total files skipped:  {skipped_files_count}")
    print("----------------------------------------")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Cleans existing permalinks in the frontmatter of .md files."
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
        clean_existing_permalinks(args.directory)
