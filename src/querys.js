const queryProductTop = `SELECT name, COUNT(*) AS total_sales
FROM public.sale_order_line
GROUP BY name
ORDER BY total_sales DESC
LIMIT 10;`;

const queryEmpleadoTop = `SELECT
p.id AS partner_id,
p.name AS partner_name,
SUM(o.amount_total) AS total_sales
FROM
public.res_partner AS p
JOIN
public.sale_order AS o ON o.partner_id = p.id
GROUP BY
p.id, p.name
ORDER BY
total_sales DESC
LIMIT 10;`;

const queryClientesTop = `SELECT p.name AS customer_name, COUNT(so.id) AS total_sales
FROM sale_order so
JOIN res_partner p ON so.partner_id = p.id
GROUP BY p.name
ORDER BY total_sales DESC
LIMIT 6;`;

const queryIngresoGastoMensual = `SELECT
EXTRACT(YEAR FROM aml.date) AS year,
EXTRACT(MONTH FROM aml.date) AS month,
SUM(CASE WHEN aml.balance >= 0 THEN aml.balance ELSE 0 END) AS ingresos,
SUM(CASE WHEN aml.balance < 0 THEN aml.balance ELSE 0 END) AS gastos
FROM
account_move_line AS aml
INNER JOIN account_move AS am ON aml.move_id = am.id
WHERE
am.state = 'posted' -- Opcional: incluye solo movimientos contables confirmados
GROUP BY
year, month
ORDER BY
year, month;`;

module.exports = {
  queryProductTop,
  queryEmpleadoTop,
  queryClientesTop,
  queryIngresoGastoMensual,
};
