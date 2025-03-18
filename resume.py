import sqlite3
import os
from datetime import datetime

def main():
    done = False
    print("Project 7")
    # create database
    dbname = 'project7.db'
    conn = sqlite3.connect(dbname)
    conn.close()
    while not done:
        print("Main Menu")
        print("A - Admin Menu")
        print("R - Restaurant Ordering Menu")
        print("Q - Quit")
        choice = input("Choice: ").upper()
        if choice == "A":
            admin(dbname)
        elif choice == "R":
            restaurant(dbname)
        elif choice == "Q":
            print("Quitting!")
            done = True
        else:
            print("Invalid, try again!")

# admin functions
def admin(dbname):
    done = False
    while not done:
        print("*** Admin Menu ***")
        print()
        print("--- Create ---")
        print("Create menu Table - A")
        print("Create orders Table- B")
        print()
        print("--- Drop ---")
        print("Drop orders Table - C")
        print("Drop menu Table - D")
        print("Drop Database - E")
        print()
        print("--- View ---")
        print("View all menu items - F")
        print("View all orders - G")
        print()
        print("--- Insert/Add/Update ---")
        print("Insert menu item - H")
        print("Update menu item - I")
        print()
        print("--- Delete ---")
        print("Delete all menu items - J")
        print("Delete a menu item - K")
        print("Delete all orders - L")
        print("Delete an order - M")
        print()
        print("--- Exit ---")
        print("X - Exit")
        choice = input("Choice: ").upper()
        if choice == "X":
            print("Exiting Admin Menu")
            done = True
        elif choice == 'A':
            createmenu(dbname)
        elif choice == 'B':
            createorder(dbname)
        elif choice == 'C':
            droporder(dbname)
        elif choice == 'D':
            dropmenu(dbname)
        elif choice == 'E':
            drop_db(dbname)
        elif choice == 'F':
            viewmenu(dbname)
        elif choice == 'G':
            vieworder(dbname)
        elif choice == 'H':
            insertmenu(dbname)
        elif choice == 'I':
            updatemenu(dbname)
        elif choice == 'J':
            deleteallmenu(dbname)
        elif choice == 'K':
            deletemenu(dbname)
        elif choice == 'L':
            deleteallorder(dbname)
        elif choice == 'M':
            deleteorder(dbname)
        else:
            print("Invalid, try again!")

# view menu function
def restaurant(dbname):
    done = False
    while not done:
        print("Restaurant Menu")
        print("I - Restaurant Information")
        print("A - Appetizers")
        print("E - Entrees")
        print("D - Desserts")
        print("B - Beverages")
        print('S - Specials')
        print("M - Modify Order")
        print("P - Place Order")
        print("X - Exit")
        choice = input("Choice: ").upper()
        if choice == "X":
            print("Exiting Restaurant Menu")
            done = True
        elif choice == 'I':
            print('Restaurant Information')
            print('Like so many American dreams, ours had a humble beginning. Three childhood friends in their 20’s who scraped together $900. Our not-so-grand opening was in 2017, in a parking lot in East Hollywood, with a couple of folding tables and a portable fryer under the night sky. But thanks to Instagram, people came. And tasted. And came back with their friends. Then, the buzz brought a reporter from EATER/LA. He took a bite of his first Dave’s Hot Chicken tender, and our world changed. The next day he posted, “East Hollywood’s New Late Night Hot Chicken Stand Might Blow Your Mind.” So much was born for us in that moment. The lines went down the street and around the block. To all the people who stand in line for hours, outside, waiting for that insane taste, do this: Reach out. Keep us honest. And keep coming back for that addictive, mind-blowing experience, just like the first bite. Oh, and if you ever wonder whether your dreams can come true, remember us. Some guys in an East Hollywood parking lot, who started with $900 and a dream of our own.')
        elif choice == 'A':
            print('Appetizers')
            appetizers(dbname)
        elif choice == 'E':
            print('Entrees')
            entrees(dbname)
        elif choice == 'D':
            print('Desserts')
            desserts(dbname)
        elif choice == 'B':
            beverages(dbname)
        elif choice == 'S':
            specials(dbname)
        elif choice == 'M':
            modify(dbname)
        elif choice == 'P':
            place(dbname)
        else:
            print("Invalid, try again!")

# drop database function
def drop_db(dbname):
    print("Delete Database File")
    # Remove the database file
    os.remove(dbname)
    print("database deleted")
def createmenu(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = '''CREATE TABLE menu (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL,
    description TEXT NOT NULL
    )'''
    cursor.execute(sql)
    print("SQL query executed")
    conn.close()
def createorder(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = '''CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_id INTEGER,
    quantity INTEGER NOT NULL,
    date DATE NOT NULL
    )'''
    cursor.execute(sql)
    print("SQL query executed")
    conn.close()
def droporder(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'DROP TABLE orders'
    cursor.execute(sql)
    print('Table Dropped')
    conn.close()
def dropmenu(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'DROP TABLE menu'
    cursor.execute(sql)
    print('Table Dropped')
    conn.close()
def viewmenu(dbname):
    print('View Menu')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'SELECT * FROM menu '
    print('ID\tName\tCategory\tPrice\tDescription')
    cursor.execute(sql)
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' +str(row[3]) + '\t' + str(row[4]))
def vieworder(dbname):
    print('View Order')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    print('ID\tName\tQuantity\tDate/Time')
    sql= "SELECT menu.name, orders.quantity, orders.date FROM menu INNER JOIN orders ON menu.menu_id=orders.menu_id"
    cursor.execute(sql)
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]))
def insertmenu(dbname):
    print('Insert into Menu')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = '''INSERT INTO menu (name, category, price, description) VALUES
    ('Fries', 'Appetizers', 3.59, 'Our perfectly seasoned and crisp fries.'),
    ('Cheese Fries', 'Appetizers', 4.99, 'Our fries with nacho cheese'),
    ('Mac & Cheese', 'Appetizers', 3.90, 'Creamy Mac n Cheese'),
    ('Kale Slaw', 'Appetizers', 3.99, 'Mixed Cabbage Salad'),
    ('10pc Daves Bites', 'Appetizers', 6.99, 'Spicy Tender Bites'),
    ('Spicy Garlic Chicken with Rice', 'Entree', 14.99, '2 million SHU garlic chicken with rice'),
    ('6pc Spicy Chicken Wings', 'Entree', 7.49, 'Carolina Reaper Spicy Wings'),
    ('Spicy Tender with bread', 'Entree', 5.49, 'Our classic tender'),
    ('Spicy Slider', 'Entree', 7.49, 'Our classic slider'),
    ('Spicy Chicken Parmesan', 'Entree', 15.99, 'Parmesan for the ones who dare'),
    ('Chocolate Shake', 'Desserts', 4.99, 'Chocolatey Goodness'),
    ('Vanilla Shake', 'Desserts', 4.99, 'Vanilla V'),
    ('Strawberry Shake', 'Desserts', 4.99, 'Strawberry Madness'),
    ('Oreo Top Loaded Chocolate Shake', 'Desserts', 6.99, 'Chocolate Shake with Oreos on top'),
    ('M&M Top Loaded Chocolate Shake', 'Desserts', 6.99, 'Chocolate Shake with M&Ms on top'),
    ('Gold Peak Peach Sweet Tea', 'Beverages', 2.99, 'Classic Peach Iced Tea'),
    ('Coke', 'Beverages', 2.99, 'Your classic Cola'),
    ('Sprite', 'Beverages', 2.99, 'Lemon-Lime carbonated drink'),
    ('Dr. Pepper', 'Beverages', 2.99, '23 Flavor Blend Unlike Any Other!'),
    ('Coke Zero', 'Beverages', 2.99, 'Zero Calorie Coca-Cola'),
    ('Daves #1', 'Specials', 12.99, '2 tenders with bread, fries, kaleslaw, and pickles.'),
    ('Daves #2', 'Specials', 14.99, '2 sliders with fries, kaleslaw, and pickles.'),
    ('Daves #3', 'Specials', 13.99, '1 slider and 1 tender with fries, kaleslaw, and pickles.'),
    ('Daves #4', 'Specials', 10.99, '1 slider with fries, kaleslaw, and pickles.'),
    ('10pc Daves Bites with Fries', 'Specials', 9.99, 'Our dave bites with our classic fries')'''
    cursor.execute(sql)
    conn.commit()
    conn.close()
def updatemenu(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'SELECT * FROM menu '
    print('ID\tName\tCategory\tPrice\tDescription')
    cursor.execute(sql)
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' +str(row[3]))
    mid = int(input('What is the menu ID of the item that you want to change? '))
    done = False
    while not done:
        choice = input('What would you like to change? [Name/Category/Price/Description] ').upper()
        if choice == 'NAME':
            new_name = input('Enter the new name. ')
            sql = 'UPDATE menu SET name = ? WHERE menu_id = ?'
            cursor.execute(sql,(new_name,mid))
            conn.commit()
            conn.close()
            done = True
        elif choice == 'CATEGORY':
            new_name = input('Enter the new category. ')
            sql = 'UPDATE menu SET category = ? WHERE menu_id = ?'
            cursor.execute(sql,(new_name,mid))
            conn.commit()
            conn.close()
            done = True
        elif choice == 'PRICE':
            new_name = input('Enter the new price. ')
            sql = 'UPDATE menu SET price = ? WHERE menu_id = ?'
            cursor.execute(sql,(new_name,mid))
            conn.commit()
            conn.close()
            done = True
        elif choice == 'DESCRIPTION':
            new_name = input('Enter the new description. ')
            sql = 'UPDATE menu SET description = ? WHERE menu_id = ?'
            cursor.execute(sql,(new_name,mid))
            conn.commit()
            conn.close()
            done = True
        else:
            print('Invalid Option')
            done = False
def deleteallmenu(dbname):
    print('Delete all menu items')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'DELETE FROM menu '
    cursor.execute(sql)
    conn.commit()
    conn.close()
    print('Items Deleted')
def deletemenu(dbname):
    print('Delete specific menu item')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'SELECT * FROM menu'
    cursor.execute(sql)
    print('ID\tName\tCategory\tPrice\tDescription')
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' +str(row[3]))
    mid = int(input('What is the menu ID of the item that you want to delete? '))
    sql = 'DELETE FROM menu WHERE menu_id = ?'
    cursor.execute(sql,(mid,))
    conn.commit()
    conn.close()
def deleteallorder(dbname):
    print('Delete all ordered items')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'DELETE FROM orders '
    cursor.execute(sql)
    conn.commit()
    conn.close()
    print('Items Deleted')
def deleteorder(dbname):
    print('Delete specific order item')
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = 'SELECT * FROM orders '
    print('ID\tName\tCategory\tPrice\tDate/Time')
    cursor.execute(sql)
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' +str(row[3]))
    oid = int(input('What is the order ID of the item that you want to delete? '))
    sql = 'DELETE FROM orders WHERE order_id = ?'
    cursor.execute(sql,(oid,))
    conn.commit()
    conn.close()
    print('Items Deleted')
def appetizers(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT * FROM menu WHERE category = 'Appetizers'"
    cursor.execute(sql)
    rows = cursor.fetchall()
    print('ID\tName\tCategory\tPrice\tDescription')
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' + str(row[3]) + '\t' + str(row[4]))
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
    done = False
    while not done:
        choice = int(input("What is the menu ID of the item that you want to order? "))
        if choice > 5 or choice < 1:
            print('Invalid ID')
        else:
            quantity = input("How much do you want? ")
            sql = '''INSERT INTO orders (menu_id, quantity, date) VALUES
                (?, ?, ?)'''
            cursor.execute(sql,(choice,quantity,formatted_date))
            conn.commit()
            done = True
    conn.close()

def entrees(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT * FROM menu WHERE category = 'Entree'"
    cursor.execute(sql)
    print('ID\tName\tCategory\tPrice\tDescription')
    rows = cursor.fetchall()
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' + str(row[3]) + '\t' + str(row[4]))
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
    done = False
    while not done:
        choice = int(input("What is the menu ID of the item that you want to order? "))
        if choice > 10 or choice < 6:
               print('Invalid ID')
        else:
            quantity = input("How much do you want? ")
            sql = '''INSERT INTO orders (menu_id, quantity, date) VALUES
                    (?, ?, ?)'''
            cursor.execute(sql,(choice,quantity,formatted_date))
            conn.commit()
            done = True
    conn.close()
def beverages(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT * FROM menu WHERE category = 'Beverages'"
    cursor.execute(sql)
    rows = cursor.fetchall()
    print('ID\tName\tCategory\tPrice\tDescription')
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' + str(row[3]) + '\t' + str(row[4]))
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
    done = False
    while not done:
        choice = int(input("What is the menu ID of the item that you want to order? "))
        if choice > 20 or choice < 16:
            print('Invalid ID')
        else:
            quantity = input("How much do you want? ")
            sql = '''INSERT INTO orders (menu_id, quantity, date) VALUES
            (?, ?, ?)'''
            cursor.execute(sql,(choice,quantity,formatted_date))
            conn.commit()
            done = True
    conn.close()
def desserts(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT * FROM menu WHERE category = 'Desserts'"
    cursor.execute(sql)
    rows = cursor.fetchall()
    print('ID\tName\tCategory\tPrice\tDescription')
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' + str(row[3]) + '\t' + str(row[4]))
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
    done = False
    while not done:
        choice = int(input("What is the menu ID of the item that you want to order? "))
        if choice > 15 or choice < 11:
            print('Invalid ID')
        else:
            quantity = input("How much do you want? ")
            sql = '''INSERT INTO orders (menu_id, quantity, date) VALUES
            (?, ?, ?)'''
            cursor.execute(sql,(choice,quantity,formatted_date))
            conn.commit()
            done = True
    conn.close()
def specials(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT * FROM menu WHERE category = 'Specials'"
    cursor.execute(sql)
    rows = cursor.fetchall()
    print('ID\tName\tCategory\tPrice\tDescription')
    for row in rows:
        print(str(row[0]) + '\t' + str(row[1]) + '\t' + str(row[2]) + '\t' + str(row[3]) + '\t' + str(row[4]))
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
    done = False
    while not done:
        choice = int(input("What is the menu ID of the item that you want to order? "))
        if choice > 25 or choice < 21:
            print('Invalid ID')
        else:
            quantity = input("How much do you want? ")
            sql = '''INSERT INTO orders (menu_id, quantity, date) VALUES
            (?, ?, ?)'''
            cursor.execute(sql,(choice,quantity,formatted_date))
            conn.commit()
            done = True
    conn.close()

def modify(dbname):
    conn = sqlite3.connect(dbname)
    cursor=conn.cursor()
    sql="SELECT menu.menu_id, menu.name, orders.quantity, orders.date FROM menu INNER JOIN orders ON menu.menu_id=orders.menu_id"
    cursor.execute(sql)
    print('Id\tName\tQuantity\tDate/Time')
    rows=cursor.fetchall()
    for row in rows:
        print(str(row[0])+"\t"+str(row[1])+"\t"+str(row[2])+'\t'+str(row[3]))
    mod=input("Would you like to modify anything? ").upper()
    if mod=="YES":
        while mod=="YES":
            mchoice=input("Do you want to delete or update? ").upper()
            if mchoice=="DELETE":
                item=int(input("What is the menu id of the item you'd like to delete? "))
                sql="DELETE FROM orders WHERE menu_id=?"
                cursor.execute(sql, (item,))
                conn.commit()
                sql="SELECT menu.menu_id, menu.name, orders.quantity, orders.date FROM menu INNER JOIN orders ON menu.menu_id=orders.menu_id"
                cursor.execute(sql)
                print('Id\tName\tQuantity\tDate/Time')
                rows=cursor.fetchall()
                for row in rows:
                    print(str(row[0])+"\t"+str(row[1])+"\t"+str(row[2]) + '\t' + str(row[3]))
                mod=input("Do you want to keep updating? ")
            elif mchoice=="UPDATE":
                mid=int(input("What is the menu id of the item you'd like to change? "))
                amt=int(input("what is the new amount you want? "))
                sql="UPDATE orders set quantity=? WHERE menu_id=?"
                cursor.execute(sql, (amt, mid))
                conn.commit()
                sql="SELECT menu.menu_id, menu.name, orders.quantity, orders.date FROM menu INNER JOIN orders ON menu.menu_id=orders.menu_id"
                cursor.execute(sql)
                print("ID\tName\tQuantity\tDate/Time")
                rows=cursor.fetchall()
                for row in rows:
                    print(str(row[0])+"\t"+str(row[1])+"\t"+str(row[2])+"\t"+row[3])
                mod=input("Do you want to keep updating? ").upper()
    elif mod=="NO":
        print('why come here then')
def place(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = "SELECT menu.menu_id, menu.name, orders.quantity, menu.price FROM menu INNER JOIN orders ON menu.menu_id=orders.menu_id"
    cursor.execute(sql)
    rows = cursor.fetchall()
    total = 0
    for row in rows:
        total += row[2] * row[3]
    print(total)
    coupon = input("Do you have a coupon? ").upper()
    if coupon == "YES":
        ctype = input("Is it a percentage or certain amount? ").upper()
        if ctype == "PERCENTAGE":
            percent = float(input("What percentage is it off? "))
            new_total = total - (total * (percent/100))
        elif ctype == "CERTAIN AMOUNT":
            amount = float(input("How much is it off? "))
            new_total = total - amount
            print(new_total)
    elif coupon == "NO":
        new_total = total
    tip = input("Would you like to tip? ").upper()
    if tip == "YES":
        tpercent = float(input("How much? [0.15/0.18/0.20]"))
        new_total1 = new_total + (new_total * tpercent)
    elif tip == "NO":
        print("bad beta")
        new_total1 = new_total
    new_total2 = new_total1 + (new_total1 * 0.06625)
    deliver = input("Delivery or pick-up? ").upper()
    if deliver == "DELIVERY":
        new_total3 = new_total2 + 5
        print("Your total is $" + str(new_total3))
    elif deliver == "PICK-UP":
        new_total3 = new_total2
        print("Your total is $" + str(new_total3))

# call to main function, do not delete!
main()

# write a function to print the total price after all functions have been completed in Python


def print_total(dbname):
    conn = sqlite3.connect(dbname)
    cursor = conn.cursor()
    sql = """
        SELECT menu.menu_id, menu.name, orders.quantity, menu.price
        FROM menu
        INNER JOIN orders ON menu.menu_id = orders.menu_id
    """
    cursor.execute(sql)
    rows = cursor.fetchall()

    print("\n=== Order Summary ===")
    subtotal = 0
    for row in rows:
        item_total = row[2] * row[3]  # quantity * price
        print(f"{row[1]}: {row[2]} x ${row[3]} = ${item_total:.2f}")
        subtotal += item_total

    print("\n=== Final Total ===")
    print(f"Subtotal: ${subtotal:.2f}")
    tax = subtotal * 0.06625
    print(f"Tax (6.625%): ${tax:.2f}")
    final_total = subtotal + tax
    print(f"Final Total: ${final_total:.2f}")

    conn.close()

print_total("restaurant.db")
