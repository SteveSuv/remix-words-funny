namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly CRYPTO_SECRET: string;
    readonly EMAIL_SERVER_ADDRESS: string;
    readonly EMAIL_SERVER_PASS: string;
  }
}
