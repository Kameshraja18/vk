# VeriDoc Pro: User Guide & Setup

## 📘 Overview
Welcome to **VeriDoc Pro**, your premium tool for document authenticity verification. This guide will help you set up and use the system effectively.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
*   **Python 3.10+**: For the forensic backend.
*   **Node.js 18+**: For the web dashboard.

### 2. Backend Setup
1.  Navigate to the `backend` folder.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    pip install paddleocr opencv-contrib-python
    ```
3.  Run the server:
    ```bash
    python main.py
    ```
    *Note: The first run will take 1-2 minutes to download the AI models.*

### 3. Frontend Setup
1.  Navigate to the `frontend` folder.
2.  Install packages:
    ```bash
    npm install
    ```
3.  Launch the dashboard:
    ```bash
    npm run dev
    ```

---

## 🖥️ Using the Dashboard

1.  **Upload**: Drag and drop your document (JPEG/PNG) into the "Analyze Assets" zone.
2.  **Scan**: Click **"Initiate Forensic Scan"**.
3.  **Interpret Results**:
    *   **ELA Mode**: Look for "bright spots" where they shouldn't be.
    *   **Noise Profile**: Check for jagged patches that indicate an image was "pasted" on.
    *   **Evidence Logs**: Read the technical breakdown for specific warnings.

---

## 💡 Best Practices
*   **Use Original Files**: Screenshots lose forensic data. Use the original camera/scan file.
*   **Check the ELA Intensity**: High ELA intensity usually means the image was saved many times or heavily edited.
*   **Verify Format**: Check the "Source & Format" log to ensure the file hasn't been re-encoded in a suspicious way.

---
*For support or technical inquiries, contact the VeriDoc AI Lab.*
