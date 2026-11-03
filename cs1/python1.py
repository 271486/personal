import math

firstName = ""  # add your first name
lastName = ""  # add your last name
print("Name: " + firstName + " " + lastName)
print("Project 5")


def main():
    myOrder = {}
    print("Welcome to La'Ziza Restaurant & Lounge")
    print("Menu")
    print("R - Restaurant Information")
    print("A - Appetizers")
    print("E - Entrees")
    print("D - Desserts")
    print("B - Beverages")
    print("M - Modify Order")
    print("P - Place Order")
    print("Q - Quit")

    done = False
    while not done:
        choice = input("Choice: ").upper()
        if choice == "Q":
            print("Quit!")
            done = True
        elif choice == "R":
            info()
        elif choice == 'A':
            appetizers(myOrder)
        elif choice == "E":
            entrees(myOrder)
        elif choice == 'D':
            desserts(myOrder)
        elif choice == 'B':
            beverages(myOrder)
        elif choice == 'M':
            mod(myOrder)
        elif choice == 'P':
            place(myOrder)
        elif choice == "C":
            for key in myOrder:
                print(key + "\t" + str(myOrder[key]))
        else:
            print("Invalid Choice")


def info():
    print(
        "Culinary, Cosmopolitan And Service Are The Main Ingredients To La Ziza "
        "Restaurant & Lounge Success Formula. A True Dedication And Insistence On "
        "Delivery Of Top Quality Products With Exemplary Service. The Philosophy "
        "Operating Behind La Ziza Restaurant & Lounge Property Is As Simple As It "
        "Is Daring – That Serious Food And Stunning Spectacle Are Not Mutually Exclusive. "
        "By Paring The Culinary Ingenuity Of World-Class Chefs, Atmospheres Crafted By "
        "Internationally Renowned Designers And The Highest Standards Of Service, La'ziza "
        "Restaurant and lounge Mission Is To Create An Unrivaled And Unforgettable "
        "Dining Experience For Every Single Customer. It Is This Combination Of "
        "Uncompromising Vision And Gourmet Expertise That Has Earned Our Group A "
        "Phenomenal Reputation As A Trendsetter At The Vanguard Of Dining In The "
        "City Of Clifton, NJ."
    )
    print('Restaurant Website: https://www.lazizanj.com/')
    print('Restaurant Location: 341 Crooks Ave, Clifton, NJ 07011')


def appetizers(myOrder):
    appetizers = {
        'Baba Ghanous': 8.50,
        'Hummus': 8.50,
        'Dynamite Shrimp': 13.95,
        'Foul': 8.50,
        'Falafel': 8.50
    }
    for Item, x in appetizers.items():
        print("---------------------------------------------")
        print("Item: " + Item)
        print("Price: $" + str(x))
        order = input('Would you like to order from this menu? [Yes/No] ')
        if order.lower() == 'yes':
            food = input('What would you like to order? ')
            if food in appetizers:
                quantity = int(input('How much do you want to order? '))
                myOrder[food] = {"amount": quantity, "Price": appetizers[food]}


def entrees(myOrder):
    entrees = {
        'Shish Tawook': 18.95,
        'Grilled Shrimp Alfredo': 28.95,
        "La'Ziza Chef Platter": 29.95,
        'Lamb Chops': 28.95,
        'Sunrise Chicken': 21.95
    }
    for Item, x in entrees.items():
        print("---------------------------------------------")
        print("Item: " + Item)
        print("Price: $" + str(x))
        order = input('Would you like to order from this menu? [Yes/No] ')
        if order.lower() == 'yes':
            food = input('What would you like to order? ')
            if food in entrees:
                quantity = int(input('How much do you want to order? '))
                myOrder[food] = {"amount": quantity, "Price": entrees[food]}
            else:
                print("Please Continue:")


def desserts(myOrder):
    desserts = {
        'Knafeh': 9.95,
        'Baklava': 6.95,
        'Lava Cake': 9.95,
        'Hazelnut Cake': 9.95,
        'Ice Cream': 6.95
    }
    for Item, x in desserts.items():
        print("---------------------------------------------")
        print("Item: " + Item)
        print("Price: $" + str(x))
        order = input('Would you like to order from this menu? [Yes/No] ')
        if order.lower() == 'yes':
            food = input('What would you like to order? ')
            if food in desserts:
                quantity = int(input('How much do you want to order? '))
                myOrder[food] = {"amount": quantity, "Price": desserts[food]}


def beverages(myOrder):
    beverages = {
        'Iced Tea': 3.95,
        'Mint Lemonade': 4.95,
        'Strawberry Smoothie': 5.99,
        'Tea with mint': 3.50,
        'Juice': 4.99
    }
    for Item, x in beverages.items():
        print("---------------------------------------------")
        print("Item: " + Item)
        print("Price: $" + str(x))
        order = input('Would you like to order from this menu? [Yes/No] ')
        if order.lower() == 'yes':
            food = input('What would you like to order? ')
            size = input('What size would you like? [Small/Medium/Large] ')
            if size.lower() == 'small' and food in beverages:
                price = beverages[food] - 1
            elif size.lower() == 'medium' and food in beverages:
                price = beverages[food]
            elif size.lower() == 'large' and food in beverages:
                price = beverages[food] + 1
            else:
                print('Invalid Choice')
                continue
            quantity = int(input('How much do you want to order? '))
            myOrder[food] = {"amount": quantity, "Price": price}


# Add mod() and place() functions here in same properly indented style

# Run the program
if __name__ == "__main__":
    main()
