
# ZERO SUM PACT

ZERO SUM PACT is a project that brings together art, history, and strategy into an collabratvie on-chain experience.

## 1. NFT Collection ZeroSumPac

Crafted by half-Japanese artist @K.Nami, this collection is an reflection on the long lasting scars of war. Each trait is carefuly crafted facet of 
war: shattered childhood, seperated family, inflation, greed and gluttony. 

Our design process began with the Shape Network's minimalistic black circle logo. After realizing it resembled a Pac-Man with a closed mouth, the concept evolved into a Pac-like figure, symbolizing the insatiable appetite for resources which is the root of conflicts.

![Sample NFT](screenshots/nft.png)

##  On-Chain Strategy Game 

Inspired by the Go, Pac-Man, and Diplomacy, this is an original multi-player "board game" designed by @ubinhash, allowing hundreds of players to compete asynchronously. It puts up players in a battle for scarce resources. The decision to compete, or collaborate, is in the player's hand.

![Sample NFT](screenshots/game.png)


# GAMEPLAY EXPLAINED

## Mechanism

## Levels, Endings and Reward




# Documentation

## Smart Contract

Due to contract size constraint and for re-usability concern, we broke up the game into modules and link them together.

### 1. Game Contract:  

Contains main game configuration and most logistics of the game such as ending conditions etc. 

Below are some main functions that player will interact with

`enterGame` : Enters the game by registering their Pac NFT. No transfer required.

(We are open to co-host future season with other nft communities in the future to jointly offer reward. We will be able to whitelist their nft to enter the game along with our Pacs.)

`movePlayerTo` : Move a player to a certain location. This will interact with maze contract to check what specific event it trigger such consuming a dot, eating other players, switching maze.

`rob`: Rob a player for dots when it's surrounded on four sides.

`buy_shield`: Buy Shield with eth.

`forfeit`: Exit and game and transfer all dots to another active player.

`lockin` : Exit the game and preserve all dots. (Available after lvl 3)


### 2. Maze Contract :

This is a helper contract of game for storing the maze info and player locations, contains helper functions for making movement in the maze. 

Game contract will interact with maze contract to query and upate the maze state when making moves.

NFT contract will interact with the maze contract to unlock maze, when certain mint count is triggered, new mazes are unlocked.

Player do not make write action to this contract directly.


### 3. Game Equip Contract

This is a helper contract of game for letting players "equip" other NFTs, such as the eyes, the keys and OTOM.

`equipEyes`: player can equip eyes to one Pac(nft character) to increase their max stride. No transfer required.

`unequipEyes`: to prevent player from abusing the system, player may unequip eyes after 24 hours.

`equipKeys`: player can equip a shapecraft key to appoint one Pac(nft character) to enter a speicial maze. One time use only for each season. No transfer required.

`shield`: player have to transfer their OTOM molecule to contract to increase shield time. The amount of time added is related to molecule's hardness. 

We added a owner-only transfer-out function in case someone accidentally transfered precious OTOMs to contract without calling shield, but theoractically OTOM molecules will stay forever in the contract.

--------------

There's an additional component in GameEquip that is related to a unique mechanism in our game.

In most of the game out there, the laws of physics of the world a.k.a the parameters is controlled by the game creator. 

Here we're adding this little experiment to see what if we give user the right to play with some major parameter that will affect every player in game.

`voteForGoverner`: players in the game can vote for a governer. The highest voted player wil automatically become the govener at UTC 0:00. 

`setEat`: The governer will have one chance to set the `EAT_PERCENTAGE` parameter anywhere between 0% - 100% for that day. This will determine how much dot a player lose when it's eaten by another player(the player eaten must be the same or lower level).


The middle-class will probably pray hope for a governer that will set EAT_PERCENTAGE to a low value, and player with no dots will pray for the opposite. As for the highest level player, it depends on their relationship with other high-level players. 

Things can turn upside down overnight when a new "governer" got elected and make drastic change to the parameter. We're excited to see what to come.


### 4. Reward Contract

This is a contract to store nft reward and for user to claim nft rewards. Game contract will call this contract to add user to add trait, or add user to the claim whitelist when condition is triggered. 

For this very first season of the game, we have prepared the following level reward.

Lv 3 Player: Special NFT Trait

Lv 4 Player: 1/1 NFT (Max 10)

Lv 5 Player: Custom NFT (Our artist will craft it upon request)

For details please check out the rules page.

We expect to make adjustment to this contract everytime we run a new season based on the prize we/future collaborator plans to offer.


### 5. NFT Contract

This is the contract for our collection. This collection is designed specifically for this hackathon.

It will interact with maze contract to unlock new mazes when mint surpass certain threshold. 





## Frontend

We're using Next.js + wagmi + rainbowkit to for frontend.

Install relevant npm packages, `npm run dev` to test it out on locally.

edit frontend components/config/config.js to set backend api url if needed.


## Backend

We are using express.js for backend to read from contract and parse the indexed events from database.

Install relevant npm packages, set the following variables in .env

`ALCHEMY_API_KEY` : Your Alchemy API Key

`RPC_SEPOLIA/RPC_MAINNET`  : RPC URL

`GAME_SEPOLIA/GAME_MAINNET` : Game Contract 

`GAME_EQUIP_SEPOLIA/GAME_EQUIP_MAINNET` : Game-Equip Contract 

`MAZE_SEPOLIA` : Maze Contract

`ZSP_SEPOLIA` : Our Zero-Sum-Pact Nft Contract 

With additional parameters to connect to our database server .

`DB_CONNECTION_STRING` : database connection string

`DB_NAME`: defined in gamesate.js for now

Then use `node index.js` to run the backend server.

Generate Cert files in  `/etc/letsencrypt/live/api.zerosumpact.xyz/`
Put relevant NGINX config in `/etc/nginx/sites-available/api.zerosumpact.xyz`

Start NGINX to serve it over https

`sudo ln -s /etc/nginx/sites-available/api.zerosumpact.xyz /etc/nginx/sites-enabled/`

`sudo nginx -t`

`sudo systemctl restart nginx`


## Data Indexing

Displaying a large "board/maze" with all player position in real time requires indexing all the movement events.

We're using goldsky's mirror pipeline to stream event log directly to the database and parse it from there, it's probably more straightforward and cost-effective solution compare to subgraph as we will expect very frequent queries of board status.

Use `goldsky pipeline apply config.yaml` to deploy a pipeline.

Note: Goldsky's contract decode tool is currently buggy at parsing signed int into database so (it was treated as unsigned), so we needed to do some custom ajustment in reading the data to accomodate that. This may cause some minor display issue when they fix their bug.

# Tools and Library Used

- Alchemy api
- Hardhat
- Wagmi + Rainbowkit library for wallet connection
- Express.js for backend
- Goldsky for indexing
- Postgres for database
- Next.js for frontend


### Additional integration

- OTOM by golid
- The "eyes" and the "keys" NFT





## Final Thoughts

This game is designed like a mini social experiment to allow hundres of player to participate asynchonously. If all player are "selfish actors" and all traverse locally optimal path, they won't be able to break free from the "equilibirum" state where all player basically gets the average amount of dots, which is less than what's required to get to a level with reward. In order level up, player will realize they have to collaborate with others, make deals/sacrifices, collaborate to surround other "prey" that out there alone , and the first set of players to realize that will level up and unlock shield which gives them a huge advantage in game.

People on web3 have limited time and attention, I don't want to build a game that requires too much grinding. I want this game to fit into those little pockets of free time in a day -- easy to pick up, easy to put down. And this will help the game become part of people's daily routine. 

It's also a less action-packed strategy game where player can only make very limited moves in game, but we expect more activity and discussion to happen outside of the game and we hope that our game will help to bond the shape community together. 


Many assumed that classic board games, especially online ones, are boring and lack interaction. But form my personal observation, they can be surprisingly social and fosters friendship, and even marriage.  The fact that the game itself is not so action-packed actually encourages player to chat and connect with one another while they're waiting for others to move. We hope that our game will help to bond the shape community together.

It's a bit challenging at first to craft a balanced board game where hundreds of player on different timezone can play together on the same "board". It's designed such that even when someone started late, they should have a chance to work with others and catch up.

 We hope the players will have fun at what we built, there're lot of potential strategy that player can try out for the game and we're excited to see what end will the world come to.