import pandas as pd

# Load file
df = pd.read_csv("Round 2_Intro_Round_Final_Scores - Final.csv", header=None)

# Header is at row 12
header_row = 12
header = df.iloc[header_row]

# Data starts at row 13
data = df[header_row + 1:].copy()
data.columns = header

# Remove empty rows
data = data.dropna(subset=["Team \nNumber"])

# Convert Total to numeric
data["Total"] = pd.to_numeric(data["Total"], errors="coerce")

# Filter Open division
open_df = data[data["Division"] == "Open"].copy()

# Sort Open by Total
open_df = open_df.sort_values("Total", ascending=False).reset_index(drop=True)

team_number = "18-3149"


# -----------------------------------------------------
# 1. Rank among ALL Open teams
# -----------------------------------------------------
if team_number in open_df["Team \nNumber"].values:
    overall_rank = open_df[open_df["Team \nNumber"] == team_number].index[0] + 1
else:
    overall_rank = None

total_open_teams = len(open_df)


# -----------------------------------------------------
# 2. Rank among NJ Open teams
# -----------------------------------------------------
nj_open_df = open_df[open_df["Location"] == "NJ"]\
                .sort_values("Total", ascending=False)\
                .reset_index(drop=True)

if team_number in nj_open_df["Team \nNumber"].values:
    nj_rank = nj_open_df[nj_open_df["Team \nNumber"] == team_number].index[0] + 1
else:
    nj_rank = None

total_nj_teams = len(nj_open_df)


# -----------------------------------------------------
# 3. Rank among Open **Platinum Tier** teams
# -----------------------------------------------------
platinum_open_df = open_df[open_df["Tier"] == "Platinum"]\
                    .sort_values("Total", ascending=False)\
                    .reset_index(drop=True)

if team_number in platinum_open_df["Team \nNumber"].values:
    platinum_rank = platinum_open_df[platinum_open_df["Team \nNumber"] == team_number]\
                    .index[0] + 1
else:
    platinum_rank = None

total_platinum_teams = len(platinum_open_df)


# -----------------------------------------------------
# PRINT RESULTS
# -----------------------------------------------------
print(f"--- Results for Team {team_number} ---")

# All Open
if overall_rank is not None:
    print(f"Overall Open Rank: {overall_rank} / {total_open_teams}")
else:
    print("Team not found in Open division.")

# NJ Open
if nj_rank is not None:
    print(f"NJ Open Rank: {nj_rank} / {total_nj_teams}")
else:
    print("Team not found among NJ Open teams.")

# Platinum Open
if platinum_rank is not None:
    print(f"Platinum-Only Open Rank: {platinum_rank} / {total_platinum_teams}")
else:
    print("Team is not a Platinum-tier Open team.")
