#!/usr/bin/python

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


# Testing the class
def main():
    dbObject = Database('passwords.db')

    dbObject.set("reddit", "test")
    password = dbObject.get("reddit")
    
    if password != None:
        print(password["password"])

main()
