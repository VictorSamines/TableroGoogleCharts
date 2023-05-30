/* Es necesario agregar "controls" de los paquetes */
google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(fetchDataAndDrawProductChart);

/* 1 */
function fetchDataAndDrawProductChart() {
  fetch("/producto")
    .then((response) => response.json())
    .then((data) => {
      drawProductChart(data);
      console.log(data)
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawProductChart(productData) {

  /* Datatable de charts */
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Name");
  data.addColumn("number", "Cantidad de Productos Vendidos");

  /* Ingresa la data de la response a -> data*/
  for (let i = 0; i < productData.length; i++) {
    let item = productData[i]
    data.addRow([item.name, parseInt(item.total_sales)])
  }

  // Opciones de personalización del gráfico
  var options = {
    title: "Platillos más vendidos",
    width: 625,
    height: 500,
    hAxis: { title: "Ventas" },
    vAxis: { title: "Productos" },
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };

  var chart = new google.visualization.ChartWrapper({
    chartType: 'BarChart',
    containerId: 'chart_div',
    // Data que hace a el gráfico
    dataTable: data,
    options: options
  });

  // Range filter
  var control = new google.visualization.ControlWrapper({
    controlType: 'NumberRangeFilter',
    // Referencia a contenedor en HTML
    containerId: 'control_div',
    options: {
      // Debe ser el mismo nombre de una de las columnas de datatable
      filterColumnLabel: 'Cantidad de Productos Vendidos',
      'ui': {'labelStacking': 'vertical'}
    }
  });

  // ---- Problema: filtrar solo los primeros 5 con valores más altos
  // Ordenar el array en orden descendente por el valor de "total_sales"
  productData.sort((a, b) => b.total_sales - a.total_sales);

  // Obtener los 5 valores más altos
  let top5 = productData.slice(0, 5);

  let valores = {
    maximo: "",
    minimo: ""
  };
  
  // Obtener el valor máximo de la copia del array top5
  let maximo = Math.max(...top5.map(item => parseInt(item.total_sales)));
  valores.maximo = maximo.toString();

  // Obtener el valor mínimo de la copia del array top5
  let minimo = Math.min(...top5.map(item => parseInt(item.total_sales)));
  valores.minimo = minimo.toString();

  console.log(valores)

  // Combina diferentes componentes gráficos y de control en un solo panel interactivo. 
  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container'));
  // establecer una relación de vinculación entre dos componentes
  dashboard.bind(control, chart);

  // Cambiar valores del control range
  changeRange = function() {
  // Le pasamos el valor mínimo y máximo calculado
  control.setState({'lowValue': valores.minimo, 'highValue': valores.maximo});
  control.draw();
  };

  dashboard.draw(data);
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

  var options = {
    title: "Empleados con Mayores Ventas",
    width: 625,
    height: 500,
    pieHole: 0.4, // Proporción del agujero central (0.4 significa un donut chart)
    colors: ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC"], // Colores personalizados para las partes del gráfico
  };

  
  var chartWrapper = new google.visualization.ChartWrapper({
    chartType: "PieChart",
    containerId: "chart-container2",
    dataTable: data,
    options: options
  });

  // Range filter
  var control2 = new google.visualization.ControlWrapper({
    controlType: 'NumberRangeFilter',
    // Referencia a contenedor en HTML
    containerId: 'control_div2',
    options: {
      // Debe ser el mismo nombre de una de las columnas de datatable
      filterColumnLabel: 'Ventas',
      'ui': {'labelStacking': 'vertical'}
    }
  });

  // Combina diferentes componentes gráficos y de control en un solo panel interactivo. 
  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container2'));
  // establecer una relación de vinculación entre dos componentes
  dashboard.bind(control2, chartWrapper);

  dashboard.draw(dataTable)
  // chart.draw(dataTable, options);
}

// Llamar a la función para el gráfico de productos
fetchDataAndDrawProductChart();