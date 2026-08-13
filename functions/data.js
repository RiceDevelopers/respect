const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    try {
        const dataPath = path.join(__dirname, '../../data/storage.json');
        
        // إذا ما فيه بيانات، رد ب array فاضي
        if (!fs.existsSync(dataPath)) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    data: [],
                    total: 0
                })
            };
        }

        // اقرأ البيانات
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);

        // دعم parameter ?latest=true عشان يجيب آخر بيانات فقط
        const params = new URLSearchParams(event.queryStringParameters || {});
        const latestOnly = params.get('latest') === 'true';

        let responseData = data;
        if (latestOnly && data.length > 0) {
            responseData = [data[data.length - 1]];
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                data: responseData,
                total: data.length
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
                error: error.message
            })
        };
    }
};