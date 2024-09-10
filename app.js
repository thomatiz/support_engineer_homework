const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');
const db = new sqlite3.Database('./database.db');

// Function to get optimization settings by myShopifyDomain
const getOptimizationSettings = (domain) => {
    db.get(`SELECT optimizationSettings FROM organization WHERE myShopifyDomain = ?`, [domain], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`Optimization Settings: ${row ? row.optimizationSettings : 'Not found'}`);
    });
};

// Function to list organizations sorted by creation date
const listOrganizations = () => {
    db.all(`SELECT createdAt, status, planName FROM organization ORDER BY createdAt ASC`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(`Created At: ${row.createdAt}, Status: ${row.status}, Plan Name: ${row.planName}`);
        });
    });
};

// Function to list canceled organizations
const listCancelledOrganizations = () => {
    db.all(`SELECT * FROM organization WHERE status = 'cancelled'`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
};

// Function to get organization by orgName
const getOrganizationByName = (orgName) => {
    db.get(`SELECT * FROM organization WHERE myShopifyDomain = ?`, [orgName], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(JSON.stringify(row, null, 2));
    });
};

// CLI menu
const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Choose a report to run:',
                choices: [
                    'Get optimization settings by myShopifyDomain',
                    'List organizations sorted by creation date',
                    'List cancelled organizations',
                    'Get organization by orgName',
                ],
            },
        ])
        .then((answers) => {
            switch (answers.option) {
                case 'Get optimization settings by myShopifyDomain':
                    inquirer
                        .prompt([{ name: 'domain', message: 'Enter myShopifyDomain:' }])
                        .then((input) => getOptimizationSettings(input.domain));
                    break;
                case 'List organizations sorted by creation date':
                    listOrganizations();
                    break;
                case 'List cancelled organizations':
                    listCancelledOrganizations();
                    break;
                case 'Get organization by orgName':
                    inquirer.prompt([{ name: 'orgName', message: 'Enter orgName:' }]).then((input) => getOrganizationByName(input.orgName));
                    break;
                default:
                    console.log('Invalid option');
            }
        });
};

// Start the app
mainMenu();
