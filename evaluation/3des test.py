import os
import time
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

def benchmark_encryption(cipher, data):
    start_time = time.time()
    cipher.encryptor().update(data)
    end_time = time.time()
    return end_time - start_time

def benchmark_decryption(cipher, data):
    start_time = time.time()
    cipher.decryptor().update(data)
    end_time = time.time()
    return end_time - start_time

# Generate a random 128-bit key for TripleDES
key = os.urandom(16)

# Prepare input data of different sizes
input_sizes = [1024, 2048, 4096, 8192]

# Perform benchmarking for TripleDES
results_des = []

for size in input_sizes:
    data = os.urandom(size)

    # TripleDES benchmark
    cipher_des = Cipher(algorithms.TripleDES(key), mode=modes.ECB(), backend=default_backend())
    encryption_time_des = benchmark_encryption(cipher_des, data)
    decryption_time_des = benchmark_decryption(cipher_des, data)
    results_des.append((size, encryption_time_des, decryption_time_des))

# Print benchmarking results
print("TripleDES Results:")
for result in results_des:
    print(
        f"Data Size: {result[0]} bytes, Encryption Time: {result[1]:.6f} seconds, Decryption Time: {result[2]:.6f} seconds")
