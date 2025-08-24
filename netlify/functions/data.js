// netlify/functions/data.js

const faunadb = require('faunadb');
const q = faunadb.query;

// อย่าลืม! คุณต้องไปตั้งค่า FAUNADB_SECRET ในหน้าตั้งค่าของเว็บคุณบน Netlify
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const COLLECTION_NAME = 'shop_data';
// เราจะใช้ ID เดียวสำหรับร้านค้าเดียว เพื่อให้ง่ายต่อการจัดการ
const DOCUMENT_ID = 'main_store_data'; 

exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        try {
            const doc = await client.query(
                q.Get(q.Ref(q.Collection(COLLECTION_NAME), DOCUMENT_ID))
            );
            return {
                statusCode: 200,
                body: JSON.stringify(doc.data),
            };
        } catch (error) {
            if (error.name === 'NotFound') {
                 return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) };
            }
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        try {
            await client.query(
                q.Update(q.Ref(q.Collection(COLLECTION_NAME), DOCUMENT_ID), { data })
            );
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Data updated' }),
            };
        } catch (error) {
            if (error.name === 'NotFound') {
                await client.query(
                    q.Create(q.Ref(q.Collection(COLLECTION_NAME), DOCUMENT_ID), { data })
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Data created' }),
                };
            }
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
    
    return {
        statusCode: 405,
        body: 'Method Not Allowed',
    };
};
