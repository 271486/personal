import pandas as pd
from pathlib import Path
import sys


def find_header_row(path, must_have_terms=("team", "total")):
	"""Scan file to find header row index containing all must_have_terms (case-insensitive)."""
	with path.open(encoding="utf-8", errors="ignore") as f:
		for i, line in enumerate(f):
			low = line.lower()
			if all(term in low for term in must_have_terms):
				return i
	return None


def find_column(columns, candidates):
	"""Find first column name that contains any of the candidate substrings (case-insensitive)."""
	cols = list(columns)
	for cand in candidates:
		for c in cols:
			if cand in c.lower():
				return c
	return None


def rank_in(df, team_col, team_value):
	mask = df[team_col] == team_value
	if not mask.any():
		return None
	return int(df[mask].index[0]) + 1


def main():
	fname = Path("Round 2_Intro_Round_Final_Scores - Final.csv")
	if not fname.exists():
		print(f"CSV file not found: {fname}")
		sys.exit(1)

	# Try to detect header row dynamically
	header_row = find_header_row(fname, must_have_terms=("team", "total"))
	if header_row is None:
		# fallback to typical row (12) if detection fails
		header_row = 12

	# Read raw with no header, keep strings so we can normalize
	df = pd.read_csv(fname, header=None, dtype=str, encoding="utf-8", engine="python")

	# Guard: ensure header_row within bounds
	if header_row >= len(df):
		print(f"Detected header_row {header_row} out of bounds for file with {len(df)} rows")
		sys.exit(1)

	header = df.iloc[header_row].fillna("").astype(str).str.strip().str.replace("\n", " ").str.replace("\r", " ")
	data = df.iloc[header_row + 1 :].copy()
	data.columns = header

	# Normalize column names
	data.columns = data.columns.str.strip().str.replace("\n", " ").str.replace("\r", " ")

	# Detect commonly used columns
	team_col = find_column(data.columns, ["team number", "team \nnumber", "team", "team#", "teamno"]) or data.columns[0]
	division_col = find_column(data.columns, ["division"]) or None
	location_col = find_column(data.columns, ["location", "state"]) or None
	tier_col = find_column(data.columns, ["tier"]) or None
	total_col = find_column(data.columns, ["total", "score"]) or None

	# Trim whitespace in key columns when present
	data[team_col] = data[team_col].fillna("").astype(str).str.strip()
	if division_col:
		data[division_col] = data[division_col].fillna("").astype(str).str.strip()
	if location_col:
		data[location_col] = data[location_col].fillna("").astype(str).str.strip()
	if tier_col:
		data[tier_col] = data[tier_col].fillna("").astype(str).str.strip()

	# Convert total column to numeric safely
	if total_col:
		data["_Total_numeric"] = pd.to_numeric(data[total_col].str.replace(",", ""), errors="coerce")
	else:
		data["_Total_numeric"] = pd.NA

	# Filter Open division (case-insensitive). If no division column, treat all rows as potential.
	if division_col:
		open_df = data[data[division_col].str.lower() == "open"].copy()
	else:
		open_df = data.copy()

	# Use numeric total for sorting
	open_df = open_df.sort_values("_Total_numeric", ascending=False, na_position="last").reset_index(drop=True)

	# Team to lookup
	team_number = "18-3149"

	# Overall Open rank
	overall_rank = rank_in(open_df, team_col, team_number)
	total_open_teams = len(open_df)

	# NJ Open rank
	if location_col:
		nj_open_df = open_df[open_df[location_col].str.upper() == "NJ"].reset_index(drop=True)
	else:
		nj_open_df = open_df.iloc[0:0]
	nj_rank = rank_in(nj_open_df, team_col, team_number)
	total_nj_teams = len(nj_open_df)

	# Platinum Open rank
	if tier_col:
		platinum_open_df = open_df[open_df[tier_col].str.lower() == "platinum"].reset_index(drop=True)
	else:
		platinum_open_df = open_df.iloc[0:0]
	platinum_rank = rank_in(platinum_open_df, team_col, team_number)
	total_platinum_teams = len(platinum_open_df)

	# PRINT RESULTS
	print(f"--- Results for Team {team_number} ---")
	if overall_rank is not None:
		print(f"Overall Open Rank: {overall_rank} / {total_open_teams}")
	else:
		print("Team not found in Open division.")

	if nj_rank is not None:
		print(f"NJ Open Rank: {nj_rank} / {total_nj_teams}")
	else:
		print("Team not found among NJ Open teams.")

	if platinum_rank is not None:
		print(f"Platinum-Only Open Rank: {platinum_rank} / {total_platinum_teams}")
	else:
		print("Team is not a Platinum-tier Open team.")


if __name__ == "__main__":
	main()

