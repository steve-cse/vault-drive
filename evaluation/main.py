import numpy as np
import matplotlib.pyplot as plt

# AES parameters
aes_key_sizes = [128, 192, 256]
aes_block_size = 128
aes_rounds = [10, 12, 14]

# ChaCha20 parameters
chacha20_key_size = 256
chacha20_block_size = 512
chacha20_rounds = 20

# Creating lists for x-axis labels
algorithms = ['AES-128', 'AES-192', 'AES-256', 'ChaCha20']

# Set the bar width
bar_width = 0.2

# Set the positions of the bars on the x-axis
r1 = np.arange(len(algorithms[:-1]))
r2 = [x + bar_width for x in r1]
r3 = [x + bar_width for x in r2]

# Plotting the data
plt.bar(r1, aes_key_sizes, color='tab:blue', width=bar_width, label='Key Size')
plt.bar(r2, [aes_block_size]*3, color='tab:orange',
        width=bar_width, label='Block Size')
plt.bar(r3, aes_rounds, color='tab:green', width=bar_width, label='Rounds')

# Adding the ChaCha20 data as a separate bar
plt.bar(len(algorithms)-1, chacha20_key_size,
        color='tab:blue', width=bar_width)
plt.bar(len(algorithms)-1+bar_width, chacha20_block_size,
        color='tab:orange', width=bar_width)
plt.bar(len(algorithms)-1+2*bar_width, chacha20_rounds,
        color='tab:green', width=bar_width)

# Labeling the axes and title
plt.xlabel('Algorithm')
plt.ylabel('Value')
plt.title('AES and ChaCha20 Parameters')

# Set x-axis tick positions and labels
plt.xticks([r + bar_width for r in range(len(algorithms))], algorithms)

# Adding specific values as labels above each bar
for i in range(len(algorithms[:-1])):
    plt.text(r1[i], aes_key_sizes[i], str(
        aes_key_sizes[i]), ha='center', va='bottom')
    plt.text(r2[i], aes_block_size, str(
        aes_block_size), ha='center', va='bottom')
    plt.text(r3[i], aes_rounds[i], str(
        aes_rounds[i]), ha='center', va='bottom')

plt.text(len(algorithms)-1, chacha20_key_size,
         str(chacha20_key_size), ha='center', va='bottom')
plt.text(len(algorithms)-1+bar_width, chacha20_block_size,
         str(chacha20_block_size), ha='center', va='bottom')
plt.text(len(algorithms)-1+2*bar_width, chacha20_rounds,
         str(chacha20_rounds), ha='center', va='bottom')

# Adding a legend
plt.legend()

# Adjusting the layout
plt.tight_layout()

# Displaying the plot
plt.show()
