import matplotlib.pyplot as plt

# Data for AES-256 and ChaCha20
algorithms = ['AES-256', 'ChaCha20']
key_sizes = [256, 256]
block_sizes = [128, 512]
rounds = [14, 20]

# Plotting the graph
fig, ax = plt.subplots()
bar_width = 0.25
index = range(len(algorithms))

bar1 = ax.bar(index, key_sizes, bar_width, label='Key Size')
bar2 = ax.bar([i + bar_width for i in index], block_sizes, bar_width, label='Block Size')
bar3 = ax.bar([i + 2 * bar_width for i in index], rounds, bar_width, label='Rounds')

ax.set_xlabel('Algorithms')
ax.set_ylabel('Bits')
ax.set_title('Key Size, Block Size, and Rounds for AES-256 and ChaCha20')
ax.set_xticks([i + bar_width for i in index])
ax.set_xticklabels(algorithms)
ax.legend()

# Displaying sizes above the bars
def autolabel(bars):
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2., height + 5,
                '%d' % int(height),
                ha='center', va='bottom')

autolabel(bar1)
autolabel(bar2)
autolabel(bar3)

plt.tight_layout()
plt.show()
