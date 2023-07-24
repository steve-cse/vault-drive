import matplotlib.pyplot as plt

# Data for ChaCha20
data_size_chacha = [1024, 2048, 4096, 8192]
encryption_time_chacha = [0.882, 0.32, 0.31, 0.56]
decryption_time_chacha = [0.45, 0.29, 0.28, 0.30]

# Data for AES
data_size_aes = [1024, 2048, 4096, 8192]
encryption_time_aes = [0.65, 0.33, 0.32, 0.34]
decryption_time_aes = [0.38, 0.31, 0.31, 0.32]

# Width of the bars
bar_width = 0.2

# Position of bars on x-axis
r1 = range(len(data_size_chacha))
r2 = [x + bar_width for x in r1]
r3 = [x + bar_width for x in r2]
r4 = [x + bar_width for x in r3]

# Create the bar graph
plt.figure(figsize=(10, 6))
plt.bar(r1, encryption_time_chacha, color='b', width=bar_width, edgecolor='black', label='ChaCha20 Encryption')
plt.bar(r2, decryption_time_chacha, color='g', width=bar_width, edgecolor='black', label='ChaCha20 Decryption')
plt.bar(r3, encryption_time_aes, color='r', width=bar_width, edgecolor='black', label='AES Encryption')
plt.bar(r4, decryption_time_aes, color='y', width=bar_width, edgecolor='black', label='AES Decryption')

# Add labels and title
plt.xlabel('Data Size (bytes)')
plt.ylabel('Time (milliseconds)')
plt.title('Encryption and Decryption Times for ChaCha20 and AES')
plt.xticks([r + bar_width * 1.5 for r in range(len(data_size_chacha))], data_size_chacha)
plt.legend()

# Show the plot
#plt.grid()
plt.show()
