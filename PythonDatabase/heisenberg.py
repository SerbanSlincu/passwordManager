#!/usr/bin/python

import sys
import pyperclip
import dataset

# service with a password
class Database():

    # (creating and) Connecting to the database
    def __init__(self, databaseName):
        self.db = dataset.connect('sqlite:///./' + databaseName)

        # Load the table
        # create the first column: service name
        # 50 is the maximum size for the service name
        self.db.create_table("passwords", primary_id="service", primary_type=self.db.types.string(50))
        self.table = self.db.load_table("passwords")
            
        # create the second column: password
        # 50 is the maximum size for the password
        self.table.create_column('password', self.db.types.string(50))


    # set a new password for a service
    def set(self, service, password):
        # typecast arguments to strings
        service = str(service)
        password = str(password)
        
        # check that an entry with the same key does not exist
        exist = self.table.find_one(service=service)
        if exist != None:
            self.table.update(dict(service=service, password=password), ['service'])
        else:
            self.table.insert(dict(service=service, password=password))

    # generate a new password for a service
    def generate(self, service):
        set(service, "Not yet defined")

    # get the password for a service
    # if it exists
    def get(self, service):
        password = self.table.find_one(service=service)

        if password == None:
            print("A password for this service has not been set")
        else:
            return password

# The interface for the command
def interface(dbObject):
    if len(sys.argv) < 2:
        printHelp()
        return

    command = str(sys.argv[1])
    
    if command == "set":
        if len(sys.argv) < 4:
            printHelp()
            return
        service = str(sys.argv[2])
        password = str(sys.argv[3])
        dbObject.set(service, password)
    elif command == "generate":
        if len(sys.argv) < 3:
            printHelp()
            return
        service = str(sys.argv[2])
        dbObject.generate(service)
    elif command == "get":
        if len(sys.argv) < 3:
            printHelp()
            return
        service = str(sys.argv[2])
        entry = dbObject.get(service)
        if entry == None:
            return
        password = entry["password"]
        pyperclip.copy(password)
    else:
        printHelp()
    
# For the 'help' command
def printHelp():
    print("heisenberg set service password")
    print("--- to set your password for a serivce")
    print

    print("heisenberg generate service")
    print("--- to generate a secure password for a serivce")
    print

    print("heisenberg get service")
    print("--- to get the password for a serivce")
    print

    print("heisenberg help")
    print("--- to obtain the list of available commands")
    print

# Where everything happens
def main():
    dbObject = Database('passwords.db')
    interface(dbObject)

main()
