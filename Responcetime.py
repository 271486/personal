import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from msg_loader import load_messages


def analyze_averages(json_path=None):
    df = load_messages(json_path)

    # Calculate response intervals
    u_res, f_res = [], []
    for i in range(1, len(df)):
        diff = (df.loc[i, 'timestamp'] - df.loc[i-1, 'timestamp']).total_seconds() / 60.0
        if 0.1 < diff < 720:  # Filter out sleep gaps
            if df.loc[i-1, 'type'] == 'Received' and df.loc[i, 'type'] == 'Sent':
                u_res.append({'time': df.loc[i, 'timestamp'], 'minutes': diff})
            elif df.loc[i-1, 'type'] == 'Sent' and df.loc[i, 'type'] == 'Received':
                f_res.append({'time': df.loc[i, 'timestamp'], 'minutes': diff})

    df_u, df_f = pd.DataFrame(u_res), pd.DataFrame(f_res)

    if df_u.empty and df_f.empty:
        print("No valid response intervals found in JSON.")
        return

    # Compute Rolling Average (Window of 15 messages)
    if not df_u.empty:
        df_u['rolling'] = df_u['minutes'].rolling(window=15, min_periods=5).mean()
    else:
        df_u['rolling'] = pd.Series(dtype=float)

    if not df_f.empty:
        df_f['rolling'] = df_f['minutes'].rolling(window=15, min_periods=5).mean()
    else:
        df_f['rolling'] = pd.Series(dtype=float)

    # Plot
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

    # Time Evolution
    if not df_u.empty:
        ax1.plot(df_u['time'], df_u['rolling'], label='Your Avg', color='blue')
    if not df_f.empty:
        ax1.plot(df_f['time'], df_f['rolling'], label="Friend's Avg", color='green')
    ax1.set_title('Response Speed Over Time (15-Msg Rolling Average)')
    ax1.legend()

    # Lifetime Mean Comparison
    means = [df_u['minutes'].mean() if not df_u.empty else 0, df_f['minutes'].mean() if not df_f.empty else 0]
    ax2.bar(['You', 'Friend'], means, color=['blue', 'green'], alpha=0.7)
    ax2.set_title('Overall Average Response Time (Minutes)')

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    analyze_averages()
