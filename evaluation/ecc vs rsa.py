import matplotlib.pyplot as plt

# Key sizes for RSA and ECC (in bits)
rsa_key_sizes = [1024, 2048, 3072, 4096]
ecc_key_sizes = [256, 384, 521]

# Labels for the x-axis
x_labels_rsa = ['RSA-1024', 'RSA-2048', 'RSA-3072', 'RSA-4096']
x_labels_ecc = ['ECC-256', 'ECC-384', 'ECC-521']

# Heights for the bars
bar_height_rsa = [1] * len(rsa_key_sizes)
bar_height_ecc = [1] * len(ecc_key_sizes)

# Plotting the bar graph
plt.barh(x_labels_rsa, rsa_key_sizes, color='blue', label='RSA')
plt.barh(x_labels_ecc, ecc_key_sizes, color='orange', label='ECC')

# Adding labels and titles
plt.xlabel('Key Size (bits)')
plt.ylabel('Algorithm')
plt.title('RSA vs. ECC Key Sizes')
plt.legend()

# Displaying the graph
plt.tight_layout()
plt.show()
