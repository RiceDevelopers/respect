const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // السماح فقط بـ POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const newData = JSON.parse(event.body);
        const dataPath = path.join(__dirname, '../../data/storage.json');
        
        // تأكد من وجود المجلد
        const dir = path.dirname(dataPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // اقرأ البيانات الحالية
        let allData = [];
        if (fs.existsSync(dataPath)) {
            try {
                const raw = fs.readFileSync(dataPath, 'utf8');
                allData = JSON.parse(raw);
            } catch (e) {
                allData = [];
            }
        }

        // أضف البيانات الجديدة مع وقت الاستلام
        allData.push({
            ...newData,
            received_at: new Date().toISOString()
        });

        // احفظ البيانات
        fs.writeFileSync(dataPath, JSON.stringify(allData, null, 2));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'success',
                message: 'Data saved successfully',
                total: allData.length
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'error',
                message: error.message
            })
        };
    }
};