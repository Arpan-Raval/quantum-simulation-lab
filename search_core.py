import math
import time

def classical_search(arr, target):
    """
    Simulates Classical Linear Search O(n)
    """
    start_time = time.perf_counter()
    comparisons = 0
    for i, val in enumerate(arr):
        comparisons += 1
        if val == target:
            end_time = time.perf_counter()
            return {"index": i, "comparisons": comparisons, "time_ms": (end_time - start_time) * 1000}
    return {"index": -1, "comparisons": comparisons, "time_ms": (time.perf_counter() - start_time) * 1000}

def np_simulation(n):
    """
    Simulates NP brute-force theoretical explosion O(2^n)
    Returns the estimated state space size.
    """
    # For large n, calculating 2^n might be too huge for normal display, return as string
    if n > 50:
        return f"2^{n} (Massive state space)"
    return 2 ** n

def quantum_simulation(n):
    """
    Simulates Grover's Algorithm expected iterations O(sqrt(n))
    """
    iterations = math.ceil((math.pi / 4) * math.sqrt(n))
    return {"iterations": iterations, "success_probability": ">99%"}

if __name__ == "__main__":
    # Test
    arr = list(range(100))
    print(classical_search(arr, 50))
    print("NP Checks for 100:", np_simulation(100))
    print("Quantum Iterations for 100:", quantum_simulation(100))
