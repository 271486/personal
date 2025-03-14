import math
import sympy as sp

def geometric_root(numbers):
    n = len(numbers)
    product = math.prod(numbers)  # Get the product of all the numbers
    root = product ** (1/n)  # Calculate the n-th root
    return root

def to_simplified_radical_form(number, n):
    # Create a symbol for the number
    x = sp.symbols('x')
    # Find the n-th root of the number symbolically
    radical = sp.root(number, n)
    return sp.simplify(radical)

while True:
    user_input = input("Enter numbers separated by spaces to calculate their geometric root, or type 'exit' to quit: ")

    if user_input.lower() == 'exit':
        print("Exiting the program.")
        break

    try:
        # Convert input string to a list of numbers
        numbers = list(map(float, user_input.split()))
        
        if len(numbers) < 2:
            print("Please enter at least two numbers.")
            continue
        
        # Calculate the geometric root as a decimal
        product = math.prod(numbers)
        n = len(numbers)
        geometric_root_decimal = geometric_root(numbers)

        # Find the geometric root in simplest radical form
        product_symbol = sp.Mul(*[sp.Rational(num) for num in numbers])  # Use rationals to keep precision
        geometric_root_radical = to_simplified_radical_form(product_symbol, n)
        
        # Display the result
        print(f"The geometric root of the numbers {numbers} is:")
        print(f"Decimal form: {geometric_root_decimal}")
        print(f"Simplified radical form: {geometric_root_radical}")
        
    except ValueError:
        print("Invalid input! Please enter numbers separated by spaces.")