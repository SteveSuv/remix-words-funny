namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly CRYPTO_SECRET: string;
  }
}
