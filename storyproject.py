import random

class Hero:
    def __init__(self, name):
        self.name = name
        self.health = 100

    def fight(self, villain):
        damage = random.randint(10, 20)
        villain.health -= damage
        print(f"{self.name} fought {villain.name} for {damage} damage.")
    def status(self):
        print(f"{self.name} is at {self.health} health.")

class Omni(Hero):
    def counter(self, villain, damage):
        villain.health -= damage
        print(f"Omni countered {villain.name} for {damage} damage.")

    def defeat(self, villain):
        villain.health = 0
        print(f"Omni defeated {villain.name}.")

class Fission(Hero):
class Fission:
    def counter(self, villain, damage):
        villain.health -= damage
        print(f"Fission countered {villain.name} for {damage} damage.")

class Custom(Hero):
class Custom:
    def counter(self, villain, damage):
        villain.health -= damage
        print(f"Custom countered {villain.name} for {damage} damage.")

    def block(self, villain, damage):
        print("Custom blocked the attack.")

    def special(self, villain, power):
        if power == "Mind Control":
            print(f"Custom used Mind Control on {villain.name}.")
        elif power == "SuperStrength":
            print(f"Custom used SuperStrength on {villain.name}.")
        elif power == "SuperSpeed":
            print(f"Custom used SuperSpeed on {villain.name}.")
        elif power == "Teleportation":
            print(f"Custom used Teleportation on {villain.name}.")
        elif power == "Telekinesis":
            print(f"Custom used Telekinesis on {villain.name}.")

class Villain:
    def __init__(self, name):
        self.name = name
        self.health = 100

omni = Omni("Omni")
fission = Fission("Fission")
custom = Custom("Custom")
omni = Omni()
fission = Fission()
custom = Custom()
darkstar = Villain("Darkstar")
mr_makecode = Villain("Mr. MakeCode")
pyro = Villain("Pyro")
slasher = Villain("Slasher")

plist = ["Mind Control", "SuperStrength", "SuperSpeed", "Teleportation", "Telekinesis"]

newchar = input("Is this a new character? (Yes/No) ")
    if newchar == 'Yes':
    oName = input('Enter Omni name: ')
    fName = input('Enter Fission name: ')
            print('Let the story begin')
            print('Title: Shadows of Light')
            print("Welcome to the gloomy world of 'Shadows of Light', where you ")
    print("step into the shoes of a random hero, alongside " + oName + ', and ' + fName + ", heroes armed with incredible powers")
            print("ready to battle the blocks of Mr. MakeCode in a quest to")
            print("restore simpler coding for all!")
    print('In the city of Lumina, where the sun never sets and technology thrives. In a journey with ' + oName + ', ' + fName + ', to stop ' + darkstar.name + ' and his minion ' + slasher.name + '.')
            print('You wake up inside your headquarters, the GDA. You go to the lobby and see Omni and Fission talking.')
            c1 = input('Do you go up to them, go to the kitchen and make breakfast, or check up on the city? ')

    if c1 == 'Talk to Omni and Fission':
            print('You go up to them and start a conversation.')
            print('Omni and Fission are discussing their latest mission.')
            print('You join in and start discussing the mission with them.')
            c6 = input('Do you want to continue the conversation or do something else? ')
            if c6 == 'Continue conversation':
                print('You continue discussing the mission with Omni and Fission.')
                print('You learn more about the mission and the villains they are facing.')
                print('You start to feel more involved in the conversation and start to contribute your own ideas.')
                print('Omni and Fission appreciate your input and start to value your opinion more.')
            elif c6 == 'Do something else':
                print('You decide to do something else and excuses yourself from the conversation.')
                print('You head to the kitchen to make breakfast for yourself.')
                print('As you are making breakfast, you start to think about the conversation you just had with Omni and Fission.')
                print('You start to feel more confident about your abilities and start to think about how you can contribute more to the team.')

    elif c1 == 'Make Breakfast':
            print('You head over to the kitchen and take eggs and bread out the fridge. You start making eggs and toast for the three of you. Once its done you call Omni and Fission to the living room and turn on the news.')
            print('They take their plates and say thanks. You turn on the TV and start scrolling through news channels to see whats happening.')
            print('You scroll past a channel but go back. You see the text on the banner saying "Pyro still at large."')
            print('You and the others only get involved with more problematic villains but think whether or not you should leave it to the local heroes. ')
            c2 = input('Do you go to the city and stop Pyro? ')
            if c2 == 'Yes':
                print('You say to Omni and Fission, "Lets finish up breakfast and deal with him. Hes been running around for too long. ')
                print('You get to the city and see Pyro setting buildings and homes aflame. ')
            c3 = input('Who do you send to take care of Pyro? [Omni/Fission/You] ')
                if c3 == 'Omni':
                    omni.counter(pyro, random.randint(1,2))
                    print('Pyro has been defeated!')
                elif c3 == 'Fission':
                    fission.counter(pyro, random.randint(1,2))
                    print('Pyro has been defeated!')
                elif c3 == 'You':
    print('You make a plan with Omni and Fission for them to distract Pyro while you go from behind and catch him off guard.')
    print('You make your way around but Pyro sees you and starts shooting flames at you')
                import random
            omni.defeat(pyro)
                print('Pyro has been defeated!')
            elif c3 == 'Fission':
                import random
                fission.counter(pyro, random.randint(1,2))
                print('Pyro has been defeated!')
            elif c3 == 'You':
                print('You make a plan with Omni and Fission for them to distract Pyro while you go from behind and catch him off guard.')
                print('You make your way around but Pyro sees you and starts shooting flames at you')
                c4 = input('What do you want to do? [Counter-attack/Block] ')
    if c4 == 'Counter-attack':
        random1 = random.randint(1,2)
        custom.counter(pyro, random1)
        if random1 == 2:
                if c4 == 'Counter-attack':
                    import random
                    random1 = random.randint(1,2)
                    custom.counter(pyro, random1)
                    if random1 == 2:
            print('Omni says you are taking too long and that he will handle it. ')
            omni.defeat(pyro)
        elif random1 == 1:
                    elif random1 == 1:
            print('You start heading back to the base when out of nowhere, Slasher comes and slices Fissions leg open.')
            print('You think of how to defeat Slasher and you decide to use one of your powers')
            for x in plist:
                print(x)
            c5 = input('Which power would you like to use? ')
            if c5 == 'Mind Control':
                custom.special(slasher, 'Mind Control')
            elif c5 == 'SuperStrength':
                custom.special(slasher, 'SuperStrength')
            elif c5 == 'SuperSpeed':
                custom.special(slasher, 'SuperSpeed')
            elif c5 == 'Teleportation':
                custom.special(slasher, 'Teleportation')
            elif c5 == 'Telekinesis':
                custom.special(slasher, 'Telekinesis')
    elif c4 == 'Block':
        random2 = random.randint(1,2)
                    custom.block(pyro, random2)
        if random2 == 2:
            print('Omni says you are taking too long and that he will handle it. ')
            omni.defeat(pyro)
        elif random2 == 1:
            print('You start heading back to the base when out of nowhere, Slasher comes and slices Fissions leg open.')
            print('You think of how to defeat Slasher and you decide to use one of your powers')
            for x in plist:
                print(x)
            c5 = input('Which power would you like to use? ')
            if c5 == 'Mind Control':
                custom.special(slasher, 'Mind Control')
            elif c5 == 'SuperStrength':
                custom.special(slasher, 'SuperStrength')
            elif c5 == 'SuperSpeed':
                custom.special(slasher, 'SuperSpeed')
            elif c5 == 'Teleportation':
                custom.special(slasher, 'Teleportation')
            elif c5 == 'Telekinesis':
                custom.special(slasher, 'Telekinesis')

                elif c4 == 'Block':
                    import random
                    custom.block(pyro, random.randint(1,2))
                    random2 = random.randint(1,2)
                    if random2 == 2:
                        print('Omni says you are taking too long and that he will handle it. ')
                        omni.defeat(pyro)
                    elif random2 == 1:
                        print('You start heading back to the base when out of nowhere, Slasher comes and slices Fissions leg open.')
                        print('You think of how to defeat Slasher and you decide to use one of your powers')
                        for x in plist:
                            print(x)
                        c5 = input('Which power would you like to use? ')
                        if c5 == 'Mind Control':
                            custom.special(slasher, 'Mind Control')
                        elif c5 == 'SuperStrength':
                            custom.special(slasher, 'SuperStrength')
                        elif c5 == 'SuperSpeed':
                            custom.special(slasher, 'SuperSpeed')
                        elif c5 == 'Teleportation':
                            custom.special(slasher, 'Teleportation')
                        elif c5 == 'Telekinesis':
                            custom.special(slasher, 'Telekinesis')
elif c2 == 'No':
    print('You decide not to get involved with Pyro and head back to the GDA.')

    elif c1 == 'Check up on the city':
        print('You decide to check up on the city and see if there are any new developments.')
        print('You start to scroll through the news channels and see if there are any new stories.')
        print('You come across a story about a new villain that is causing trouble in the city.')
        print('You start to read the story and learn more about the villain and their powers.')
        print('You start to feel more engaged in the story and start to think about how you can help stop the villain.')
        c7 = input('Do you want to learn more about the villain or do something else? ')
        if c7 == 'Learn more':
            print('You continue to read the story and learn more about the villain and their powers.')
            print('You start to think about how you can use your powers to stop the villain and save the city.')
            print('You start to feel more determined and start to think about how you can take action.')
        elif c7 == 'Do something else':
            print('You decide to do something else and stop reading the story.')
            print('You start to think about other things and start to do something else.')
            print('As you are doing something else, you start to feel more distracted and start to lose focus.')
if slasher.health <= 0:
    print("You defeated Slasher!")
else:
    print("Slasher is still alive!")

c8 = input('What do you do next? [Go to the city/Monitor the news/Check on Fission] ')
if c8 == 'Go to the city':
    print('You decide to go to the city to see if there are any other villains causing trouble.')
    print('As you arrive, you notice a group of people running away from something.')
    print('You follow the crowd and see Darkstar, the most powerful villain in the city.')
    c9 = input('What do you do? [Attack Darkstar/Call for backup] ')
    if c9 == 'Attack Darkstar':
        print('You charge at Darkstar, ready to fight.')
        custom.fight(darkstar)
            import random
            custom.counter(darkstar, random.randint(1,2))
        if darkstar.health <= 0:
            print('You defeated Darkstar!')
        else:
            print('Darkstar is still alive!')
    elif c9 == 'Call for backup':
        print('You call for backup and wait for Omni and Fission to arrive.')
        omni.fight(darkstar)
        fission.fight(darkstar)
            omni.defeat(darkstar)
            fission.counter(darkstar, 2)
        if darkstar.health <= 0:
            print('You and your team defeated Darkstar!')
        else:
            print('Darkstar is still alive!')

elif c8 == 'Monitor the news':
    print('You decide to monitor the news to see if there are any updates on the villains.')
    print('As you are watching, you see a breaking news report about a new villain in the city.')
    print('The villain is revealed to be Mr. MakeCode, the most powerful villain in the world.')
    c10 = input('What do you do? [Go to the city/Prepare for battle] ')
    if c10 == 'Go to the city':
        print('You decide to go to the city to stop Mr. MakeCode.')
        print('As you arrive, you see Mr. MakeCode and his minions causing chaos.')
        custom.fight(mr_makecode)
            import random
            custom.counter(mr_makecode, random.randint(1,2))
        if mr_makecode.health <= 0:
            print('You defeated Mr. MakeCode!')
        else:
            print('Mr. MakeCode is still alive!')
    elif c10 == 'Prepare for battle':
        print('You decide to prepare for battle and train with your team.')
        print('After a long training session, you and your team are ready to face Mr. MakeCode.')
        omni.fight(mr_makecode)
        fission.fight(mr_makecode)
        custom.fight(mr_makecode)
            omni.defeat(mr_makecode)
            fission.counter(mr_makecode, 2)
            custom.counter(mr_makecode, 2)
        if mr_makecode.health <= 0:
            print('You and your team defeated Mr. MakeCode!')
        else:
            print('Mr. MakeCode is still alive!')

elif c8 == 'Check on Fission':
    print('You decide to check on Fission and see how he is doing.')
    print('As you arrive, you see that Fission is still injured from the battle with Slasher.')
    c11 = input('What do you do? [Help Fission/Go to the city] ')
    if c11 == 'Help Fission':
        print('You decide to help Fission and nurse him back to health.')
        print('After a long recovery session, Fission is back to full strength.')
        fission.status()
    elif c11 == 'Go to the city':
        print('You decide to go to the city to stop the villains.')
        print('As you arrive, you see the city in chaos and the villains causing trouble.')
        custom.fight(darkstar)
        custom.fight(mr_makecode)
            import random
            custom.counter(darkstar, random.randint(1,2))
            custom.counter(mr_makecode, random.randint(1,2))
        if darkstar.health <= 0 and mr_makecode.health <= 0:
            print('You defeated the villains and saved the city!')
        else:
            print('The villains are still alive!')

elif newchar == 'No':
    print('Let the story begin')
    print('Title: Shadows of Light')
    print("Welcome to the gloomy world of 'Shadows of Light', where you ")
    print("step into the shoes of a random hero, alongside Omni and Fission, heroes armed with incredible powers")
    print("ready to battle the blocks of Mr. MakeCode in a quest to")
    print("restore simpler coding for all!")
    print('In the city of Lumina, where the sun never sets and technology thrives. In a journey with Omni and Fission, to stop Darkstar and his minion Slasher.')
    print('In the city of Lumina, where the sun never sets and technology thrives. In a journey with Omni and Fission, to stop ' + darkstar.name + ' and his minion ' + slasher.name + '.')
    print('You wake up inside your headquarters, the GDA. You go to the lobby and see Omni and Fission talking.')
    c1 = input('Do you go up to them, go to the kitchen and make breakfast, or check up on the city? ')
    c1 = input('Do you go up to them, go to the kitchen and make breakfast, or check up on the city? ')
    if c10 == 'Go to the city':
        print('You decide to go to the city to stop Mr. MakeCode.')
        print('As you arrive, you see Mr. MakeCode and his minions causing chaos.')
        custom.fight(mr_makecode)
            import random
            custom.counter(mr_makecode, random.randint(1,2))
        if mr_makecode.health <= 0:
            print('You defeated Mr. MakeCode!')
        else:
            print('Mr. MakeCode is still alive!')
    elif c10 == 'Prepare for battle':
        print('You decide to prepare for battle and train with your team.')
        print('After a long training session, you and your team are ready to face Mr. MakeCode.')
        omni.fight(mr_makecode)
        fission.fight(mr_makecode)
        custom.fight(mr_makecode)
            omni.defeat(mr_makecode)
            fission.counter(mr_makecode, 2)
            custom.counter(mr_makecode, 2)
        if mr_makecode.health <= 0:
            print('You and your team defeated Mr. MakeCode!')
        else:
            print('Mr. MakeCode is still alive!')

elif c8 == 'Check on Fission':
    print('You decide to check on Fission and see how he is doing.')
    print('As you arrive, you see that Fission is still injured from the battle with Slasher.')
    c11 = input('What do you do? [Help Fission/Go to the city] ')
    if c11 == 'Help Fission':
        print('You decide to help Fission and nurse him back to health.')
        print('After a long recovery session, Fission is back to full strength.')
        fission.status()
    elif c11 == 'Go to the city':
        print('You decide to go to the city to stop the villains.')
        print('As you arrive, you see the city in chaos and the villains causing trouble.')
        custom.fight(darkstar)
        custom.fight(mr_makecode)
            import random
            custom.counter(darkstar, random.randint(1,2))
            custom.counter(mr_makecode, random.randint(1,2))
        if darkstar.health <= 0 and mr_makecode.health <= 0:
            print('You defeated the villains and saved the city!')
        else:
            print('The villains are still alive!')

elif newchar == 'No':
    print('Let the story begin')
    print('Title: Shadows of Light')
    print("Welcome to the gloomy world of 'Shadows of Light', where you ")
    print("step into the shoes of a random hero, alongside Omni and Fission, heroes armed with incredible powers")
    print("ready to battle the blocks of Mr. MakeCode in a quest to")
    print("restore simpler coding for all!")
    print('In the city of Lumina, where the sun never sets and technology thrives. In a journey with Omni and Fission, to stop Darkstar and his minion Slasher.')
    print('In the city of Lumina, where the sun never sets and technology thrives. In a journey with Omni and Fission, to stop ' + darkstar.name + ' and his minion ' + slasher.name + '.')
    print('You wake up inside your headquarters, the GDA. You go to the lobby and see Omni and Fission talking.')
    c1 = input('Do you go up to them, go to the kitchen and make breakfast, or check up on the city? ')
