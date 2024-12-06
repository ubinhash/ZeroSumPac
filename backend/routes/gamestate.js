const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Client } = require('pg');
require('dotenv').config();



const DB = {
    'shape-mainnet': {
        connectionString: process.env.DB_CONNECTION_STRING,
        dbname:''
    },
    'shape-sepolia': {
        connectionString: process.env.DB_CONNECTION_STRING,
        dbname:'shape_sepolia_raw_logs_sep5'
    }
};

const getGridSize= () => {
    return 20;
}

function unsignedToSigned(value) {
    const maxInt256 = BigInt("0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    const bigValue = BigInt(value);
    return bigValue > maxInt256 ? bigValue - (BigInt(1) << BigInt(256)) : bigValue;
}


function logDisplay(logs) {
    const logsDisplay = [];

    logs.forEach(log => {
        if (log.event_signature === "PlayerMoved") {
            const [maze, x, y, playerid] = log.event_params;

            logsDisplay.push({
                string: `Player ${playerid} Moved to Maze (${maze},${x},${y})`,
                playerid: [playerid]
            });
        } else if (log.event_signature === "DotChanged") {
            const [dotdelta, playerid] = log.event_params;
            const dotdeltaUnsigned = BigInt(dotdelta); // Replace with the actual database value
            const dotdeltaSigned = unsignedToSigned(dotdeltaUnsigned);

            logsDisplay.push({
                string: `Player ${playerid} Dot Change: ${dotdeltaSigned > 0 ? "+" : ""}${dotdeltaSigned}`,
                playerid: [playerid]
            });
        } else if (log.event_signature === "PlayerAttacked") {
            const [attackerplayerid, victimplayerid, dotdelta] = log.event_params;

            logsDisplay.push({
                string: `Player ${attackerplayerid} Attacked Player ${victimplayerid}, Dot Change: ${dotdelta > 0 ? "+" : ""}${dotdelta}`,
                playerid: [attackerplayerid, victimplayerid]
            });
        } else if (log.event_signature === "PlayerRobbed") {
            const [attackerplayerid, victimplayerid] = log.event_params;

            logsDisplay.push({
                string: `Player ${attackerplayerid} Robbed Player ${victimplayerid}`,
                playerid: [attackerplayerid, victimplayerid]
            });
        } else if (log.event_signature === "PlayerStatusChanged") {
            const [statuscode, playerid] = log.event_params;
            const statusMapping = {
                "0": "Inactive",
                "1": "Active",
                "2": "LockedIn",
                "3": "Forfeit",
                "4": "Eliminated"
            };
            logsDisplay.push({
                string: `Player ${playerid} Status Changed:  ${statusMapping[statuscode.toString()]}`,
                playerid: [playerid]
            });
        }

    });

    return logsDisplay;
}

router.get('/logs', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    const connectionString=DB[network].connectionString;
    const dbname=DB[network].dbname;
    const client = new Client({ connectionString });

    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');


        const query = `
            SELECT *
            FROM ${dbname}
            ORDER BY block_number DESC, transaction_index DESC, log_index DESC;
        `;
        const result = await client.query(query);


        const parsedData = result.rows; // `rows` contains the query results as an array of objects
        res.json(logDisplay(parsedData));

    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error fetching logs' });
    } finally {
        // Disconnect from the database
        await client.end();
    }
});

router.get('/rawlogs', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    const connectionString=DB[network].connectionString;
    const dbname=DB[network].dbname;
    const client = new Client({ connectionString });

    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');


        const query = `
            SELECT *
            FROM ${dbname}
            ORDER BY block_number DESC, transaction_index DESC, log_index DESC;
        `;
        const result = await client.query(query);


        const parsedData = result.rows; // `rows` contains the query results as an array of objects
        res.json(parsedData);

    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error fetching logs' });
    } finally {
        // Disconnect from the database
        await client.end();
    }
});



        // const query = `
        //     SELECT *
        //     FROM ${dbname}
        //     WHERE event_signature = $1
        //     AND event_params[array_length(event_params, 1)] = $2
        //     ORDER BY block_number DESC, transaction_index DESC, log_index DESC
        //     LIMIT 1;
        // `;
        // const values = ['PlayerMoved', '1']; // Match 'PlayerMoved' and last event_params = '3'
        
        // const result = await client.query(query, values);

router.get('/player_locations', async (req, res) => {
    const {maze_number = 0, network="shape-sepolia" } = req.query;
    console.log(maze_number,req.query)
    const connectionString=DB[network].connectionString;
    const dbname=DB[network].dbname;
    const client = new Client({ connectionString });
    const gridsize=getGridSize();
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');


        const query = `
            WITH RankedEvents AS (
                SELECT *,
                    event_params[array_length(event_params, 1)]::text AS playerid,
                    ROW_NUMBER() OVER (
                        PARTITION BY event_params[array_length(event_params, 1)]::text
                        ORDER BY block_number DESC, transaction_index DESC, log_index DESC
                    ) AS rank
                FROM ${dbname}
                WHERE event_signature = $1
            )
            SELECT *
            FROM RankedEvents
            WHERE rank = 1 AND event_params[1]::INTEGER = $2; -- Filter by maze number
        `;
        const values = ['PlayerMoved', maze_number];


        const result = await client.query(query, values);

        // Initialize a 20x20 grid with zeros
        const grid = Array.from({ length: gridsize }, () => Array(gridsize).fill(0));

        // Populate the grid with player IDs
        result.rows.forEach(row => {
            const [, x, y, playerid] = row.event_params.map(Number);
            if (x >= 0 && x < gridsize && y >= 0 && y < gridsize) {
                grid[x][y] = playerid; // Note: y is the row, x is the column
            }
        });
        res.send(grid);

   

    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error fetching logs' });
    } finally {
        // Disconnect from the database
        await client.end();
    }
});

router.get('/dot_locations', async (req, res) => {
    const {maze_number = 0,network="shape-sepolia" } = req.query;
    const connectionString=DB[network].connectionString;
    const dbname=DB[network].dbname;
    const client = new Client({ connectionString });
    const gridsize=getGridSize();
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');



        const grid = Array.from({ length: 20 }, () => Array(20).fill(0));

        // Query all PlayerMoved events for the given maze ID
        const query = `
            SELECT event_params
            FROM ${dbname}
            WHERE event_signature = 'PlayerMoved' AND event_params[1]::INTEGER = $1
            ORDER BY block_number, transaction_index, log_index;
        `;

        const result = await client.query(query, [maze_number]);

        // Update the grid with traversed locations
        for (const row of result.rows) {
            const [, x, y] = row.event_params.map(Number); // Extract x and y as numbers
            if (x >= 0 && x < 20 && y >= 0 && y < 20) {
                grid[x][y] = 1; // Mark the grid cell as traversed
            }
        }
        res.send(grid);

   

    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error fetching logs' });
    } finally {
        // Disconnect from the database
        await client.end();
    }
});


router.get('/rankings', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    const connectionString=DB[network].connectionString;
    const dbname=DB[network].dbname;
    const client = new Client({ connectionString });
    const gridsize=getGridSize();
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');


        const query = `
            SELECT event_params
            FROM ${dbname}
            WHERE event_signature = 'DotChanged'
            ORDER BY block_number, transaction_index, log_index;
        `;

        const result = await client.query(query);

        // Process the results
        const playerDots = {};

        result.rows.forEach(row => {
            const [dotdelta, playerid] = row.event_params; // Extract dotdelta and playerid
            const dotdeltaUnsigned = BigInt(dotdelta); // Replace with the actual database value
            const dotdeltaSigned = unsignedToSigned(dotdeltaUnsigned);
            const delta = parseInt(dotdeltaSigned, 10); // Ensure dotdelta is a number

            if (!playerDots[playerid]) {
                playerDots[playerid] = 0; // Initialize player's dots
            }

            playerDots[playerid] += delta; // Accumulate dots
        });

        // Create a ranked array
        const rankings = Object.entries(playerDots)
            .map(([playerid, totalDots]) => ({ playerid, totalDots }))
            .sort((a, b) => b.totalDots - a.totalDots); // Sort by dots in descending order


        res.send(rankings);

   

    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error fetching logs' });
    } finally {
        // Disconnect from the database
        await client.end();
    }
});

module.exports = router;

