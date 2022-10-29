from pyteal import *


class Picturea:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION") 
        price = Bytes("PRICE") 
        likes = Bytes("LIKES") 
        forsale = Bytes("FORSALE")
        sold = Bytes("SOLD")
        

    class AppMethods:
        like = Bytes("like")
        pausesale = Bytes("pausesale")
        resumesale = Bytes("resumesale")
        buy = Bytes("buy")


    # to create a new picture application
    def application_creation(self):
        return Seq([
            Assert(
                And(
                    Txn.application_args.length() == Int(4),
                    # The note attached to the transaction must be "picturea:uv2",
                    #  which we define to be the note that marks a picture within our marketplace
                    Txn.note() == Bytes("picturea_dapp:uv0.3"),
                    Btoi(Txn.application_args[3]) > Int(0),
                    Len(Txn.application_args[0]) > Int(0),
                    Len(Txn.application_args[1]) > Int(0),
                    Len(Txn.application_args[2]) > Int(0),
                )
            ), 

            # Store the transaction arguments into the applications's global's state
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.description, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.likes, Int(0)),
            App.globalPut(self.Variables.forsale, Int(1)),
            App.globalPut(self.Variables.sold, Int(0)),

            Approve(),
        ])

    def buy(self):
            count = Txn.application_args[1]
            valid_number_of_transactions = Global.group_size() == Int(2)

            valid_payment_to_seller = And(
                Gtxn[1].type_enum() == TxnType.Payment,
                Gtxn[1].receiver() == Global.creator_address(),
                Gtxn[1].amount() == App.globalGet(self.Variables.price) * Btoi(count),
                Gtxn[1].sender() == Gtxn[0].sender(),
            )

            can_buy = And(valid_number_of_transactions,
                        valid_payment_to_seller)

            update_state = Seq([
                App.globalPut(self.Variables.sold, App.globalGet(self.Variables.sold) + Btoi(count)),
                Approve()
            ])

            return If(can_buy).Then(update_state).Else(Reject())

    

    # like
    def like(self):
        Assert(
            And(
                    Global.group_size() == Int(1),
                    Txn.sender() != Global.creator_address(),
                    Txn.applications.length() == Int(1),
                    Txn.application_args.length() == Int(1),
               
            ),
        ),
        return Seq([
            App.globalPut(self.Variables.likes, App.globalGet(self.Variables.likes) + Int(1)),
            Approve()
        ])


    # pauses the current sale of a picture
    def pausesale(self):
        Assert(
            And(
                Txn.application_args.length() == Int(1),
                Txn.sender() == Global.creator_address(),
                App.globalGet(self.Variables.forsale) == Int(1),
            ),
        ),
        return Seq([
            App.globalPut(self.Variables.forsale, Int(0)),
            Approve()
        ])

    # resumes a sale of a picture
    def resumesale(self):
        Assert(
            And(
                Txn.application_args.length() == Int(1),
                Txn.sender() == Global.creator_address(),
                App.globalGet(self.Variables.forsale) == Int(0),
            ),
        ),
        return Seq([
            App.globalPut(self.Variables.forsale, Int(1)),
            Approve()
        ])

    # To delete a picture.
    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    # Check transaction conditions
    def application_start(self):
        return Cond(
            # checks if the application_id field of a transaction matches 0.
            # If this is the case, the application does not exist yet, and the application_creation() method is called
            [Txn.application_id() == Int(0), self.application_creation()],
            # If the the OnComplete action of the transaction is DeleteApplication, the application_deletion() method is called
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            # if the first argument of the transaction matches the AppMethods.buy value, the buy() method is called.
            [Txn.application_args[0] == self.AppMethods.like, self.like()],
            [Txn.application_args[0] == self.AppMethods.pausesale, self.pausesale()],
            [Txn.application_args[0] == self.AppMethods.resumesale, self.resumesale()],
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
        )

    # The approval program is responsible for processing all application calls to the contract.
    def approval_program(self):
        return self.application_start()

    # The clear program is used to handle accounts using the clear call to remove the smart contract from their balance record.
    def clear_program(self):
        return Return(Int(1))