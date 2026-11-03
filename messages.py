import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from msg_loader import load_messages

def analyze_sms_data(json_path=None):
    """Analyze received messages frequency from a JSON data source."""
    df = load_messages(json_path)

    # Filter to Received messages
    recv = df[df['type'] == 'Received'].copy()
    if recv.empty:
        print("No 'Received' messages found in JSON.")
        return

    # Bin into 30-minute intervals (48 bins total)
    recv['bin_index'] = recv['timestamp'].apply(lambda x: x.hour * 2 + (0 if x.minute < 30 else 1))

    all_bins = pd.DataFrame({'bin_index': range(48)})
    all_bins['time_label'] = pd.to_datetime(all_bins['bin_index'] * 30, unit='m').dt.strftime('%I:%M %p')

    counts = recv['bin_index'].value_counts().reset_index()
    counts.columns = ['bin_index', 'msg_count']
    final_df = all_bins.merge(counts, on='bin_index', how='left').fillna(0)

    plt.figure(figsize=(15, 7))
    plt.bar(final_df['time_label'], final_df['msg_count'], color='skyblue', edgecolor='navy')
    plt.title('Frequency of Received Messages by Time of Day', fontsize=16)
    plt.xlabel('Time (30-min Intervals)', fontsize=12)
    plt.ylabel('Number of Messages', fontsize=12)
    plt.xticks(rotation=90)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()


def analyze_sms_datav2(json_path=None):
    """Analyze sent messages frequency from a JSON data source."""
    df = load_messages(json_path)
    sent = df[df['type'] == 'Sent'].copy()
    if sent.empty:
        print("No 'Sent' messages found in JSON.")
        return

    sent['bin_index'] = sent['timestamp'].apply(lambda x: x.hour * 2 + (0 if x.minute < 30 else 1))

    all_bins = pd.DataFrame({'bin_index': range(48)})
    all_bins['time_label'] = pd.to_datetime(all_bins['bin_index'] * 30, unit='m').dt.strftime('%I:%M %p')

    counts = sent['bin_index'].value_counts().reset_index()
    counts.columns = ['bin_index', 'msg_count']
    final_df = all_bins.merge(counts, on='bin_index', how='left').fillna(0)

    plt.figure(figsize=(15, 7))
    plt.bar(final_df['time_label'], final_df['msg_count'], color='red', edgecolor='skyblue')
    plt.title('Frequency of Sent Messages by Time of Day', fontsize=16)
    plt.xlabel('Time (30-min Intervals)', fontsize=12)
    plt.ylabel('Number of Messages', fontsize=12)
    plt.xticks(rotation=90)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    # Launcher or users can pass a different JSON path by editing the constant or calling functions directly.
    from multiprocessing import Process

    p1 = Process(target=analyze_sms_data)
    p2 = Process(target=analyze_sms_datav2)

    p1.start()
    p2.start()

    p1.join()
    p2.join()
