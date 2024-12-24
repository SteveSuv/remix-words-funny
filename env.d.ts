namespace NodeJS {
  interface ProcessEnv {
    readonly POSTGRES_PASSWORD: string;
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly CRYPTO_SECRET: string;
  }
}
