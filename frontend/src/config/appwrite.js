import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('66a0fc2800063a2b7702'); 

const account = new Account(client);

export { account, client };
