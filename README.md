# Personal CLI Utilities

This repository is a collection of personal command-line scripts. They are designed to solve specific, recurring problems and automate tedious tasks.

## Setup

### Prerequisites
*   Git
*   Node.js (for `.js` based tools)

### Installation

1.  **Clone the repository:**

    ```bash
    # Clone it to a permanent location on your machine
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/VOTRE_NOM_DE_REPO.git
    ```

2.  **Add the `bin` directory to your system's PATH:**

    To make the tools globally available from any terminal, you must add the full path to this repository's `/bin` directory to your Windows PATH environment variable.

    *   Press the Windows key, search for `env`, and select "Edit the system environment variables".
    *   In the System Properties window, click `Environment Variables...`.
    *   In the top section ("User variables"), find the `Path` variable, select it, and click `Edit...`.
    *   Click `New` and paste the full path to the `bin` directory (e.g., `C:\Users\YourName\Documents\cli-tools\bin`).
    *   Click OK on all windows to apply the changes.

    **Note:** You must restart any open terminal sessions for the PATH changes to take effect.

## Available Tools

### `extract-code`

*   **Purpose:** Scans a project directory, generates a file tree, and consolidates the contents of all relevant source files into a single text file. Primarily used to generate a comprehensive context for Large Language Models.
*   **Usage:** Navigate to the root of the project you wish to process, then run the command.
    ```bash
    cd /path/to/your/project
    extract-code
    ```
    This will generate an `all_code_extract.txt` file in the current directory.
*   **Configuration:** File extensions and excluded directories can be modified directly in the source script.
*   **Source:** [`/src/code-extractor/extractCode.js`](./src/code-extractor/extractCode.js)

---

## Development

This is a personal project, but suggestions or bug reports via Issues are welcome.

## License

MIT