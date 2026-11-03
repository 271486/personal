# passengers.py
# Passenger search tool (updated: option 3 now prints total count in age range)

names = [
    "Richard Sadd","Thomas Wakefield","Thomas Bennett","Steven Read","William Stanbridge",
    "Henry Barker","James Foster","Thomas Talbott","Richard Young","Robert Thomas",
    "John Farepoynt","Robert Askyn","Samuell Awde","Miles Fletcher","William Evans",
    "Lawrence Farebern","Mathew Robinson","Richard Hersey","John Robinson","Edmond Chipps",
    "Thomas Pritchard","Jonathan Bronsford","William Cowley","John Shawe","Richard Gummy",
    "Bartholomew Holton","John White","Thomas Chappell","Hugh Fox","Davie Morris",
    "Rowland Cotton","William Thomas","John Yates","Richard Wood","Isack Bull",
    "Phillipp Remmington","Radulph Spraging","George Chaundler","Thomas Johnson","George Brookes",
    "Robert Sabyn","Phillipp Parsons","Henry Parsons","John Eeles","Richard Miller",
    "Symon Richardson","Thomas Boomer","George Dulmare","John Underwood","William Bernard",
    "Charles Wallinger","Ryce Hooe","John Carter",
    # Women
    "Elizabeth Remington","Dorothy Standich","Suzan Death","Elizabeth Death","Alice Remmington",
    "Dorothie Baker","Elizabeth Baker","Sara Colebank","Mary Thurrogood"
]

ages = [
    23,17,22,24,27,
    18,21,20,31,20,
    20,22,24,27,23,
    23,24,22,32,19,
    32,21,20,16,21,
    25,21,33,24,32,
    22,22,20,36,27,
    29,37,29,19,35,
    40,10,14,16,12,
    23,13,8,19,27,
    24,36,54,
    20,22,22,3,26,
    18,18,20,19
]

passengers = [{"name": n, "age": a} for n, a in zip(names, ages)]

def search_by_name(query: str):
    q = query.strip().casefold()
    return [p for p in passengers if q in p["name"].casefold()]

def search_by_age(age):
    try:
        age = int(age)
    except ValueError:
        return []
    return [p for p in passengers if p["age"] == age]

def search_by_age_range(min_age, max_age):
    try:
        lo = int(min_age); hi = int(max_age)
    except ValueError:
        return []
    return [p for p in passengers if lo <= p["age"] <= hi]

def counts_by_brackets(brackets=None):
    if brackets is None:
        brackets = [(0,4),(5,13),(14,17),(18,24),(25,34),(35,44),(45,200)]
    counts = {}
    for lo, hi in brackets:
        label = f"{lo}-{hi}"
        counts[label] = sum(1 for p in passengers if lo <= p["age"] <= hi)
    return counts

def print_matches(results):
    if not results:
        print("No matches found.")
        return
    for p in results:
        print(f"{p['name']} — {p['age']}")

def print_all():
    for p in passengers:
        print(f"{p['name']} — {p['age']}")

def main():
    menu = """
Passenger search tool — choose an option:
1) Search by name (substring, case-insensitive)
2) Search by exact age
3) Search by age range (min,max)
4) Counts by age brackets (0-4, 5-13, 14-17, 18-24, 25-34, 35-44, 45+)
5) Show total passenger count
6) Print all passengers
q) Quit
"""
    while True:
        print(menu)
        choice = input("Enter choice: ").strip().lower()
        if choice == "1":
            q = input("Enter name or substring to search: ")
            print_matches(search_by_name(q))
        elif choice == "2":
            a = input("Enter age to search (e.g. 19): ")
            print_matches(search_by_age(a))
        elif choice == "3":
            r = input("Enter min and max age separated by a comma (e.g. 5,13): ")
            try:
                lo, hi = map(int, r.split(","))
            except Exception:
                print("Invalid input. Use format like: 5,13")
                continue
            results = search_by_age_range(lo, hi)
            print_matches(results)
            print(f"\nTotal passengers aged {lo}-{hi}: {len(results)}\n")
        elif choice == "4":
            counts = counts_by_brackets()
            print("Counts by bracket:")
            for k, v in counts.items():
                print(f"  {k}: {v}")
        elif choice == "5":
            print(f"Total passengers: {len(passengers)}")
        elif choice == "6":
            print_all()
        elif choice in ("q", "quit", "exit"):
            print("Goodbye.")
            break
        else:
            print("Invalid choice, try again.")

if __name__ == "__main__":
    main()
