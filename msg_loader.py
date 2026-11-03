import json
import pandas as pd
from pathlib import Path


def load_messages(json_path=None):
    """Load messages from a JSON file.

    Expected JSON format: a list of objects, each with at least these keys:
      - type: "Sent" or "Received"
      - timestamp: ISO datetime or human-friendly string parseable by pandas

    If json_path is None, looks for ~/Desktop/Log_Info/messages.json
    Returns a pandas.DataFrame with columns: type (capitalized), timestamp (datetime)
    """
    # If no path provided, try a list of common filenames in multiple likely locations:
    #  - repository Log_Info (next to this file)
    #  - current working directory Log_Info
    #  - user's Desktop/Log_Info (original behavior)
    if json_path is None:
        repo_log = Path(__file__).resolve().parent / "Log_Info"
        cwd_log = Path.cwd() / "Log_Info"
        desktop_log = Path.home() / "Desktop" / "Log_Info"

        candidate_dirs = [repo_log, cwd_log, desktop_log, Path(__file__).resolve().parent, Path.cwd()]
        filenames = [
            "messaeg_1.json",
            "message_1.json",
            "messages.json",
            "messaeg1.json",
            "message1.json",
        ]

        found = None
        checked = []
        for d in candidate_dirs:
            for name in filenames:
                p = d / name
                checked.append(str(p))
                if p.exists():
                    found = p
                    break
            if found:
                break

        if found is None:
            raise FileNotFoundError(f"JSON messages file not found. Checked: {', '.join(checked)}")

        json_path = found
    else:
        json_path = Path(json_path)

        if not json_path.exists():
            raise FileNotFoundError(f"JSON messages file not found: {json_path}")

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # If this looks like a Facebook messages export (has 'messages' list)
    if isinstance(data, dict) and "messages" in data:
        msgs = data["messages"]

        # If messages contain 'sender_name' and 'timestamp_ms', convert to expected format
        if msgs and isinstance(msgs[0], dict) and 'sender_name' in msgs[0] and 'timestamp_ms' in msgs[0]:
            # Determine my name if participants list exists
            me_name = None
            if isinstance(data.get('participants'), list) and len(data['participants']) >= 2:
                # Heuristic: assume second participant is 'me'
                try:
                    me_name = data['participants'][1].get('name')
                except Exception:
                    me_name = None

            normalized = []
            for m in msgs:
                sender = m.get('sender_name')
                ts_ms = m.get('timestamp_ms')
                if ts_ms is None:
                    continue
                ts = pd.to_datetime(ts_ms, unit='ms', origin='unix', utc=False)
                # Determine type
                if me_name is not None and sender == me_name:
                    mtype = 'Sent'
                else:
                    mtype = 'Received'

                normalized.append({'type': mtype, 'timestamp': ts})

            df = pd.DataFrame(normalized)
            df = df.drop_duplicates().sort_values('timestamp').reset_index(drop=True)
            return df

        # Fallback: if messages are already in desired simple format
        df = pd.DataFrame(msgs)
    else:
        df = pd.DataFrame(data)

    # Expecting columns 'type' and 'timestamp' now
    if "type" not in df.columns or "timestamp" not in df.columns:
        raise ValueError("JSON must contain 'type' and 'timestamp' fields for each message or be a Facebook export with 'sender_name' and 'timestamp_ms'.")

    df = df[['type', 'timestamp']].copy()
    df['type'] = df['type'].astype(str).str.capitalize()
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp']).sort_values('timestamp').reset_index(drop=True)

    return df
