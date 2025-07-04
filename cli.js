import { Command } from "commander";
import { Server } from "./server/Server.js";
import { AxiosClient } from "./AxiosClient.js";

const program = new Command();

program
    .command('register-user')
    .requiredOption('--name <string>', 'Name of the user')
    .requiredOption('--email <string>', 'Email of the user')
    .requiredOption('--pwd <string>', 'Enter your password please')
    .requiredOption('--repwd <string>', 'Re- enter the password')
    .action(async (options) => {
        if (options.pwd != options.repwd) {
            console.log("Both the password do not match");
            process.exit(1);
        }

        const server = new Server();
        await server.init();
        await server.startServer();

        const client = new AxiosClient();
        const data = {
            "name": options.name,
            "email": options.email,
            "password": options.pwd
        }

        await client.registerUser(data);
    })

program
    .command('login')
    .requiredOption('--email <string>', 'Email of the user')
    .requiredOption('--pwd <string>', 'Enter your password please')
    .action(async (options) => {
        const server = new Server();
        await server.init();
        await server.startServer();

        const client = new AxiosClient();
        const data = {
            "email": options.email,
            "password": options.pwd
        }

        await client.loginUser(data);
    })

program
    .command('create-todo')
    .option('--title <string>', 'Title of the TODO')
    .option('--des <string>', 'Description of the TODO')
    .action(async (options) => {
        const server = new Server();
        await server.init();
        await server.startServer();

        const client = new AxiosClient();
        const data = {
            "title": options.title,
            "description": options.des
        }

        await client.createTodo(data);
    })

program
    .command('delete-todo')
    .requiredOption('--id <string>', 'Id of the blog')
    .action(async (options) => {
        const server = new Server();
        await server.init();
        server.startServer();

        const client = new AxiosClient();
        await client.deleteTodoTask(options.id);
    });

program
    .command('logout')
    .action(async (options) => {

        const client = new AxiosClient();
        await client.logout();
    })

program.parse()