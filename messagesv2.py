import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats
from msg_loader import load_messages
from pathlib import Path

def analyze_response_times(json_path=None):
    df = load_messages(json_path)

    user_res, friend_res = [], []
    for i in range(1, len(df)):
        diff = (df.loc[i, 'timestamp'] - df.loc[i-1, 'timestamp']).total_seconds() / 60.0
        # Filter: Responses between 0.1 mins and 12 hours
        if 0.1 < diff < 720:
            if df.loc[i-1, 'type'] == 'Received' and df.loc[i, 'type'] == 'Sent':
                user_res.append({'time': df.loc[i, 'timestamp'], 'minutes': diff})
            elif df.loc[i-1, 'type'] == 'Sent' and df.loc[i, 'type'] == 'Received':
                friend_res.append({'time': df.loc[i, 'timestamp'], 'minutes': diff})

    df_u, df_f = pd.DataFrame(user_res), pd.DataFrame(friend_res)

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

    def plot_trend(ax, data, title, color):
        if not data.empty:
            data['time_num'] = (data['time'] - data['time'].min()).dt.total_seconds()
            slope, intercept, r, p, std = stats.linregress(data['time_num'], data['minutes'])
            ax.scatter(data['time'], data['minutes'], alpha=0.4, color=color)
            ax.plot(data['time'], slope * data['time_num'] + intercept, color='red', linewidth=2)
            ax.set_title(title)
            ax.set_ylabel('Minutes')
            plt.setp(ax.get_xticklabels(), rotation=30)

    plot_trend(ax1, df_u, "Your Response Time (Sent)", "blue")
    plot_trend(ax2, df_f, "Friend Response Time (Received)", "green")

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    analyze_response_times()
