# P vs NP vs Quantum: Interactive Simulation Lab

An interactive, visual experimentation platform demonstrating the fundamental differences in computational complexity between Classical algorithms (P), Brute-Force approaches (NP), and Quantum computing (Grover's Algorithm).

![QuantumLab](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Flask-blue)

## Features

- **Interactive Simulation Dashboard**: Visualize array searching operations in real-time.
- **Cyberpunk Aesthetic**: Modern UI with glassmorphism, glowing animations, and glitch effects.
- **Three Execution Modes**:
  - **Classical Search (O(n))**: Visual scanline sweeping through data.
  - **NP Simulation (O(2^n))**: Explosive brute-force visualization.
  - **Quantum Search (O(√n))**: Superposition collapse and quantum circuit overlay.
- **Step-by-Step Mode**: Manually advance classical and NP algorithms frame-by-frame for deep learning.
- **Live Complexity Charting**: Visual comparisons using Chart.js.

## Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quantum-simulation-lab.git
   cd quantum-simulation-lab
   ```

2. **Install dependencies:**
   Ensure you have Python installed. Then run:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask Server:**
   ```bash
   python app.py
   ```

4. **Access the Lab:**
   Open your browser and navigate to `http://127.0.0.1:5000/`.

## Built With
* Vanilla HTML / CSS / JavaScript
* [Chart.js](https://www.chartjs.org/) for data visualization
* Python [Flask](https://flask.palletsprojects.com/) for the backend server

## License
MIT License
