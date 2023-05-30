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

  var data = new google.visualization.DataTable();
  data.addColumn("string", "Name");
  data.addColumn("number", "Cantidad de Productos Vendidos");

  /* Ingresa la data de la response a -> data*/
  for (let i = 0; i < productData.length; i++) {
    let item = productData[i]
    data.addRow([item.name, parseInt(item.total_sales)])
  }

  var options = {
    title: 'Ventas por cantidad de Producto',
    is3D: true,
  };

  var chart = new google.visualization.ChartWrapper({
    chartType: 'PieChart',
    containerId: 'chart_div',
    dataTable: data,
    options: options
  });

  // Range filter
  var control = new google.visualization.ControlWrapper({
    controlType: 'NumberRangeFilter',
    containerId: 'control_div',
    options: {
      // Personalización
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

  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container'));
  dashboard.bind(control, chart);

  changeRange = function() {
  // Le pasamos el valor mínimo y máximo calculado
  control.setState({'lowValue': valores.minimo, 'highValue': valores.maximo});
  control.draw();
  };

  dashboard.draw(data);
}

