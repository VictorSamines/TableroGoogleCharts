google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(fetchDataAndDrawProductChart);

function fetchDataAndDrawProductChart() {
  fetch("/producto")
    .then((response) => response.json())
    .then((data) => {
      drawProductChart(data);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawProductChart(data) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Producto");
  dataTable.addColumn("number", "Ventas");

  data.forEach((item) => {
    dataTable.addRow([item.name, parseInt(item.total_sales)]);
  });

  var options = {
    title: "Productos más vendidos",
    legend: { position: "none" },
    hAxis: { title: "Ventas" },
    vAxis: { title: "Productos" },
  };

  var chart = new google.visualization.BarChart(
    document.getElementById("chart-container")
  );
  chart.draw(dataTable, options);

  // Llamar a la función para el gráfico de empleados después de dibujar el gráfico de productos
  fetchDataAndDrawEmployeeChart();
}

function fetchDataAndDrawEmployeeChart() {
  fetch("/empleado")
    .then((response) => response.json())
    .then((data) => {
      drawEmployeeChart(data);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawEmployeeChart(data) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Empleado");
  dataTable.addColumn("number", "Ventas");

  // Ordenar los datos por total de ventas en orden descendente
  data.sort((a, b) => parseFloat(b.total_sales) - parseFloat(a.total_sales));

  // Tomar solo los 5 primeros empleados con mayores ventas
  var topEmployees = data.slice(0, 5);

  topEmployees.forEach((employee) => {
    dataTable.addRow([employee.partner_name, parseFloat(employee.total_sales)]);
  });

  var options = {
    title: "Top 5 Empleados con Mayores Ventas",
    pieHole: 0.4, // Proporción del agujero central (0.4 significa un donut chart)
    colors: ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC"], // Colores personalizados para las partes del gráfico
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("chart-container2")
  );
  chart.draw(dataTable, options);
}

// Llamar a la función para el gráfico de productos
fetchDataAndDrawProductChart();

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(fetchDataAndDrawClienteChart);

function fetchDataAndDrawClienteChart() {
  fetch("/clientes")
    .then((response) => response.json())
    .then((data) => {
      drawChart(data);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawChart(data) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Cliente");
  dataTable.addColumn("number", "Total de ventas");

  data.forEach((cliente) => {
    dataTable.addRow([cliente.customer_name, parseInt(cliente.total_sales)]);
  });

  var options = {
    title: "Clientes más frecuentes",
    legend: { position: "none" },
    hAxis: { title: "Cliente" },
    vAxis: { title: "Total de ventas" },
    bars: "vertical",
    colors: ["#4285F4"],
  };

  var chart = new google.visualization.ColumnChart(
    document.getElementById("chart-container3")
  );
  chart.draw(dataTable, options);
}
fetchDataAndDrawClienteChart();
