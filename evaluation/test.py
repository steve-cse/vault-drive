import os
import time
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
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


# Generate a random 256-bit key and a 128-bit nonce
backend = default_backend()
salt = os.urandom(16)
password = b'my_password'
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=backend
)
key = kdf.derive(password)
nonce = os.urandom(16)

# Prepare input data of different sizes
input_sizes = [1024, 2048, 4096, 8192]

# Perform benchmarking for ChaCha20 and AES
results_chacha20 = []
results_aes = []

for size in input_sizes:
    data = os.urandom(size)

    # ChaCha20 benchmark
    cipher_chacha20 = Cipher(algorithms.ChaCha20(
        key, nonce), mode=None, backend=backend)
    encryption_time_chacha20 = benchmark_encryption(cipher_chacha20, data)
    decryption_time_chacha20 = benchmark_decryption(cipher_chacha20, data)
    results_chacha20.append(
        (size, encryption_time_chacha20, decryption_time_chacha20))

    # AES benchmark
    cipher_aes = Cipher(algorithms.AES(key), mode=modes.ECB(), backend=backend)
    encryption_time_aes = benchmark_encryption(cipher_aes, data)
    decryption_time_aes = benchmark_decryption(cipher_aes, data)
    results_aes.append((size, encryption_time_aes, decryption_time_aes))

# Print benchmarking results
print("ChaCha20 Results:")
for result in results_chacha20:
    print(
        f"Data Size: {result[0]} bytes, Encryption Time: {result[1]:.6f} seconds, Decryption Time: {result[2]:.6f} seconds")

print("\nAES Results:")
for result in results_aes:
    print(
        f"Data Size: {result[0]} bytes, Encryption Time: {result[1]:.6f} seconds, Decryption Time: {result[2]:.6f} seconds")
