import { Pool, PoolConnection } from "mysql2/promise";

export interface TransactionManager {
  withinTransaction<T>(fn: (tx: PoolConnection) => Promise<T>): Promise<T>;
}

export class TransactionManagerImpl implements TransactionManager {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async withinTransaction<T>(
    fn: (tx: PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
