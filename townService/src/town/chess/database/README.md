Kevin Wieczorek -- Database Setup and Functionality

# MySQL
This project relies on a local MySQL database to keep track of usernames and their associated ELO.


## MySQL Download and Setup
If you're using Microsoft Windows, you can use this page: https://dev.mysql.com/downloads/installer/
You can customize which features you want when using the installer, but for the purpose of this project, you just need the server
that will be hosted on your local machine, and a command line client. 
Refer to this page for more detail: https://dev.mysql.com/doc/refman/8.0/en/mysql-installer.html

For other operating systems, please use this page: https://dev.mysql.com/doc/mysql-getting-started/en/

When performing the setup, our project assumes that the connection to the database will be for **user 'root'** with **password 'coveytown'**.
You are free to change this, but you will need to make changes accordingly in **database.ts** in the private _dbConnect method.


## Creating the Database and Table
You are free to change the name of the database, but if you don't want to update **database.ts** accordingly,
just use what is provided below. 

It is extremely important that you do not change the name of the table or the names of the primary key or field, as the **database.ts**
assumes these are unchanged. 

In the MySQL command line, first create a database by typing in:

```CREATE DATABASE chesselo;```

To make this database the active one, type in:

```USE chesselo;```

Now, create a table as such:

```CREATE TABLE player_elo (Username varchar(63) NOT NULL, ELO int, PRIMARY KEY (Username));```

To view the table and check its' fields, types, and more to verify it is correct, you can use:

```DESCRIBE player_elo;```

Once this is done, you've successfully set up the table and it can be used with the project. If you'd like, you can
insert data into the table from the start, or let **database.ts** handle adding new entries if needed.


# Dependencies
The following modules and APIs should be installed on your local machine:
mysql2
@types/node
ts-node

Refer to this for additional help with installing: https://www.npmjs.com/package/mysql2


# Database Class Attributes (database.ts)

## ._db
Private property of the class with type Connection (from mysql2). Used for connecting to the local MySQL database.

## ._defaultELO
Private number that acts as the default ELO for any Usernames not already in the player_elo table.


# Database Class Methods (database.ts)

## ._dbConnect()
Private method that is called whenever you make a new Database object. This creates the connection with the local database.
Here, you can adjust the MySQL user, password, and database name. 

## .dbClose()
Public method that is called after all necessary operations on the database are done. This closes the connection with the local database.
Must be called separately, or else the connection will never close by itself.

## .db_getELO(playerName: string) --> any (typecasted into number)
Public async method that returns the ELO of a given Username. If the Username exists, the method will return the ELO as type 'any'.
Correct and intended usage of this function is as follows:

```const database = new Database();
const myELO: number = await database.db_getELO('myName');
```

In the event that you pass a string that is not found in the table, it will instead call **.db_setELO()** and create a new entry of that 
name and return the default ELO **(._defaultELO)**.

## .db_setELO(playerName: string, playerELO: number)
Public async method that inserts or updates the ELO of the given Username to the given ELO. 
If the given Username does not exist, it will insert that Username and ELO into the table.
If the given Username does exist, it will update that Username and ELO in the table.

Correct and intended usage of this function is as follows:

```const database = new Database();
database.db_setELO('myName', 2000);
```

## .db_getAllELO() --> dictionary,  { [username: string]: any} | null
Public async method that returns the top ten usernames and their associated ELOs from the database ordered by their ELO. 
This uses the connection with the database and makes a query to retrieve this information and store it in a dictionary.
It returns the dictionary. This is intended to only be called by the MatchResult class' leaderboardElo() function.

Correct and intended usage of this function is as follows:

```
const database = new Database();
const output: { [username: string]: any } | null = await database.db_getAllELO();
```


# MatchResult Class Attributes (elo.ts)

## .player1_user
Username of player 1 of type string

## .player2_user
Username of player 2 of type string

## .game_score
The result of the match from the "perspective of player 1". This number can only be either:

0 - Loss
0.5 - Draw
1 - Win

For example, if Player 1 beats Player 2, correct initialization of a MatchResult object is as follows:

```
const result = new MatchResult('player1', 'player2', 1);
```

The order matters, so be sure to give extra attention when using this. 


# MatchResult Class Methods (elo.ts)

## ._calculateRatingChange(elo1: number, elo2: number) --> number
Private method that calculates the amount the ELO's of the two players will change according to their ELO before the match
and the result of the game. Returns a number.

## .updateELO()
Public async method that creates a new Database object and then calls .db_getELO() from the Database class 
for .player1_user and .player2_user. These numbers are passed to ._calculateRatingChange, and the returned value is used 
with .game_score to determine the final ELO's. The method calls .db_setELO() from the Database class for both players
and then finally calls .dbClose() to close the connection.

Correct and intended usage of this function is as follows:

```
const result = new MatchResult('player1', 'player2', 1);
result.updateELO()
```

## MatchResult.leaderboardElo() --> dictionary,  { [username: string]: any} | null
Public async and static method that returns a dictionary of the top ten usernames and ELOs from the database
ordered by ELO. Since the method is static, there is no need to create a MatchResult object to use it. This function
acts as a mediator function, as it creates the connection to the database for you and calls db_getAllELO in the Database class.

Correct and intended usage of this function is as follows:

```
const output: { [username: string]: any } | null = await MatchResult.leaderboardElo();
for (const key in output) {
  if (Object.hasOwn(output, key)) {
    // ... do something
  }
}
```

