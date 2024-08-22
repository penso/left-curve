import type {
  Account,
  AccountType,
  Address,
  Chain,
  Client,
  Credential,
  Hex,
  Key,
  KeyHash,
  Transport,
  Username,
} from "@leftcurve/types";
import { getAppConfig } from "./getAppConfig";
import { simulate } from "./simulate";

export type CreateAccountParameters = {
  username: Username;
  key: Key;
  keyHash: KeyHash;
  accountType: AccountType;
};

export type CreateAccountReturnType = Promise<Hex>;

export type MsgRegisterUser = {
  registerUser: {
    username: string;
    KeyHash: Hex;
    key: Credential;
    accountType: "spot" | "margin";
  };
};

export async function createAccount<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: CreateAccountParameters,
): CreateAccountReturnType {
  const { username, keyHash, key, accountType } = parameters;

  const accountFactory = await getAppConfig<Address>(client, { key: "account_factory" });

  const registerMsg = {
    registerUser: {
      username,
      keyHash,
      key,
      accountType,
    },
  };

  const executeMsg = {
    execute: {
      contract: accountFactory,
      msg: registerMsg,
      funds: {},
    },
  };

  const { gasLimit } = await simulate(client, {
    simulate: { sender: accountFactory, msgs: [executeMsg], data: null },
  });

  const tx = {
    sender: accountFactory,
    msgs: [executeMsg],
    gasLimit: gasLimit,
    data: null,
    credential: null,
  };

  return await client.broadcast(tx);
}
