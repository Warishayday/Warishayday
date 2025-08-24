// netlify/functions/data.js

const { Pool } = require('pg');

// สร้างการเชื่อมต่อโดยใช้ connection string จาก Environment Variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const TABLE_NAME = 'shop_data';
const ROW_ID = 1; // เราจะใช้แค่แถวเดียวเพื่อเก็บข้อมูล JSON ทั้งหมด

exports.handler = async (event, context) => {
    const client = await pool.connect();
    try {
        // ตรวจสอบว่ามีตารางอยู่หรือไม่ ถ้าไม่มีให้สร้าง
        await client.query(`
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id INT PRIMARY KEY,
                data JSONB
            );
        `);

        if (event.httpMethod === 'GET') {
            const res = await client.query(`SELECT data FROM ${TABLE_NAME} WHERE id = $1`, [ROW_ID]);
            if (res.rows.length === 0) {
                return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) };
            }
            return {
                statusCode: 200,
                body: JSON.stringify(res.rows[0].data),
            };
        }

        if (event.httpMethod === 'POST') {
            const appData = JSON.parse(event.body);
            // ใช้คำสั่ง INSERT ... ON CONFLICT (UPSERT) เพื่อสร้างหรืออัปเดตข้อมูลในแถวเดียว
            await client.query(
                `INSERT INTO ${TABLE_NAME} (id, data) VALUES ($1, $2)
                 ON CONFLICT (id) DO UPDATE SET data = $2;`,
                [ROW_ID, appData]
            );
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Data saved successfully' }),
            };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };

    } catch (error) {
        console.error('Database error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
    } finally {
        client.release(); // คืน connection กลับสู่ pool ทุกครั้งที่ทำงานเสร็จ
    }
};

