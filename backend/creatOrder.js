import { getPool } from "./db2.js";
import sql from "mssql";

async function createOrder(orderData) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        // Transaction başlat
        await transaction.begin();

        let customerId;

        // 0️⃣ Müşteri var mı kontrol et
        const requestCheck = new sql.Request(transaction);
        const customerCheck = await requestCheck
            .input('personId', sql.Int, orderData.PersonID)
            .query('SELECT * FROM customers WHERE PersonID = @personId');

        if (customerCheck.recordset.length > 0) {
            // 1️⃣ Müşteri varsa → bilgilerini güncelle
            customerId = customerCheck.recordset[0].customer_id;

            const requestUpdate = new sql.Request(transaction);
            await requestUpdate
                .input('personId', sql.Int, orderData.PersonID)
                .input('fullName', sql.NVarChar, orderData.deliveryInfo.firstName + ' ' + orderData.deliveryInfo.lastName)
                .input('phone', sql.NVarChar, orderData.deliveryInfo.phone)
                .input('email', sql.NVarChar, orderData.deliveryInfo.email)
                .input('address', sql.NVarChar, orderData.deliveryInfo.address)
                .query(`
                    UPDATE customers
                    SET full_name = @fullName,
                        phone = @phone,
                        email = @email,
                        address = @address
                    WHERE PersonID = @personId
                `);
        } else {
            // 2️⃣ Müşteri yoksa → yeni kayıt ekle
            const requestInsert = new sql.Request(transaction);
            const customerInsert = await requestInsert
                .input('personId', sql.Int, orderData.PersonID)
                .input('fullName', sql.NVarChar, orderData.deliveryInfo.firstName + ' ' + orderData.deliveryInfo.lastName)
                .input('phone', sql.NVarChar, orderData.deliveryInfo.phone)
                .input('email', sql.NVarChar, orderData.deliveryInfo.email)
                .input('address', sql.NVarChar, orderData.deliveryInfo.address)
                .query(`
                    INSERT INTO customers (PersonID, full_name, phone, email, address)
                    OUTPUT INSERTED.customer_id
                    VALUES (@personId, @fullName, @phone, @email, @address)
                `);

            customerId = customerInsert.recordset[0].customer_id;
        }

        // 3️⃣ Orders tablosuna insert
        const requestOrder = new sql.Request(transaction);
        const orderResult = await requestOrder
            .input('customerId', sql.Int, customerId)
            .input('totalPrice', sql.Decimal(18,2), orderData.total_price)
            .query(`
                INSERT INTO orders (customer_id, order_date, total_price)
                OUTPUT INSERTED.order_id
                VALUES (@customerId, GETDATE(), @totalPrice)
            `);

        const orderId = orderResult.recordset[0].order_id;

        // 4️⃣ Order_Items tablosuna insert
        for (let item of orderData.items) {
            const requestItem = new sql.Request(transaction);
            await requestItem
                .input('orderId', sql.Int, orderId)
                .input('phoneName', sql.NVarChar, item.phone_name)
                .input('quantity', sql.Int, item.quantity)
                .input('unitPrice', sql.Decimal(18,2), item.unit_price)
                .input('subtotal', sql.Decimal(18,2), item.subtotal)
                .query(`
                    INSERT INTO order_items (order_id, phone_name, quantity, unit_price, subtotal)
                    VALUES (@orderId, @phoneName, @quantity, @unitPrice, @subtotal)
                `);
        }

        // Her şey başarılıysa commit
        await transaction.commit();
        return { success: true, orderId };

    } catch (err) {
        // Hata olursa rollback
        await transaction.rollback();
        console.error('Sipariş ekleme hatası:', err);
        return { success: false, error: err.message };
    }
}

export default createOrder;
