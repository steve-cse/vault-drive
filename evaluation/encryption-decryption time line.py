import matplotlib.pyplot as plt

# Data for ChaCha20
data_size_chacha = [1024, 2048, 4096, 8192]
encryption_time_chacha = [0.88, 0.32, 0.31, 0.56]
decryption_time_chacha = [0.45, 0.29, 0.28, 0.30]

# Data for AES
data_size_aes = [1024, 2048, 4096, 8192]
encryption_time_aes = [0.65, 0.33, 0.32, 0.34]
decryption_time_aes = [0.38, 0.31, 0.31, 0.32]

# Data for DES
data_size_des = [1024, 2048, 4096, 8192]
encryption_time_des = [2.74, 0.14, 0.21, 0.37]
decryption_time_des = [0.12, 0.13, 0.22, 0.37]

# Create line plot for Encryption times
plt.figure(figsize=(10, 6))
plt.plot(data_size_chacha, encryption_time_chacha,
         marker='o', color='b', label='ChaCha20 Encryption')
plt.plot(data_size_aes, encryption_time_aes,
         marker='o', color='r', label='AES Encryption')
plt.plot(data_size_des, encryption_time_des,
         marker='o', color='g', label='DES Encryption')

# Add labels and title for Encryption times plot
plt.xlabel('Data Size (bytes)')
plt.ylabel('Time (seconds)')
plt.title('Encryption Times Comparison (ChaCha20 vs. AES vs. DES)')
plt.legend()

# Show the Encryption times plot
plt.grid()
plt.show()

# Create line plot for Decryption times
plt.figure(figsize=(10, 6))
plt.plot(data_size_chacha, decryption_time_chacha,
         marker='o', color='b', label='ChaCha20 Decryption')
plt.plot(data_size_aes, decryption_time_aes,
         marker='o', color='r', label='AES Decryption')
plt.plot(data_size_des, decryption_time_des,
         marker='o', color='g', label='DES Decryption')

# Add labels and title for Decryption times plot
plt.xlabel('Data Size (bytes)')
plt.ylabel('Time (seconds)')
plt.title('Decryption Times Comparison (ChaCha20 vs. AES vs. DES)')
plt.legend()

# Show the Decryption times plot
plt.grid()
plt.show()
