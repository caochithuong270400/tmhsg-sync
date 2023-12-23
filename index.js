var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())
var { conn, sql } = require('./connections/mssql');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

require('dotenv').config();

app.get('/getData', async function (req, res) {
    try {
        var pool = await conn;
        const { TuNgay, DenNgay } = req.query;

        var sqlString = `SELECT TiepNhan_Id FROM dbo.XacNhanChiPhi WHERE NgayXacNhan BETWEEN '${TuNgay}' AND '${DenNgay}'`;
        const data = await pool.request().query(sqlString);

        if (data.recordset.length > 0) {
            const resultArray = data.recordset.map(record => record.TiepNhan_Id);

            const promises = [];

            resultArray.forEach(tiepNhanId => {
                const spQueryString = `EXEC dbo.sp_BangKe01_NgoaiTru_eClaim_TT130 @TiepNhan_Id = ${tiepNhanId}`;
                const promise = pool.request().query(spQueryString, { multiple: true });
                promises.push(promise);
            });
            Promise.all(promises)
                .then(results => {
                    res.send({ result: results }); // Gửi kết quả từ tất cả các truy vấn EXEC về client
                    console.log(results);

                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Lỗi khi thực hiện stored procedure');
                });
        } else {
            res.status(404).send('Không có dữ liệu phù hợp');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
    }
});

// app.get('get-bills', requier(''))


// Đường dẫn của file WebP đầu vào và file JPG đầu ra
const inputFileName = 'company_test.webp';
const outputFileName = 'company_test_converted.jpg';

// Đường dẫn của thư mục ảnh trên ổ đĩa D
const imgFolderPath = 'D:/WORK/img/test/webp';

// Đường dẫn đầy đủ đến file WebP đầu vào
const inputFilePath = path.join(imgFolderPath, inputFileName);

// Đường dẫn đầy đủ đến file JPG đầu ra
const outputFilePath = path.join(imgFolderPath, outputFileName);

// Đọc dữ liệu từ file WebP
const inputBuffer = fs.readFileSync(inputFilePath);

// Chuyển đổi từ WebP sang JPG và lưu vào file đầu ra
sharp(inputBuffer)
    .toFormat('jpeg')
    .toFile(outputFilePath, (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Chuyển đổi thành công:', info);
        }
    });

app.listen(3131, function () {
    console.log("http://Localhost:3131");
});
