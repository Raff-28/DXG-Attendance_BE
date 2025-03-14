export class TransactionManagerImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async withinTransaction(fn) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await fn(connection);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
