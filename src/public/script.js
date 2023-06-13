/* Es necesario agregar "controls" de los paquetes */
google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(fetchDataAndDrawProductChart);

/* -> Utilidad top 5 */
// ---- Problema: filtrar solo los primeros 5 con valores más altos
// Ordenar el array en orden descendente por el valor de "total_sales"
function top5(paramDataFn) {
  // Nota: solo aplica a la ruta /producto y /empleado
  paramDataFn.sort((a, b) => b.total_sales - a.total_sales);

  // Obtener los 5 valores más altos
  let top5 = paramDataFn.slice(0, 5);

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

  return valores
}

/* ---------------- CHART 1  ----------------*/
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
  data.addColumn("number", "Cantidad de Platillos Vendidos");

  /* Ingresa la data de la response a -> data*/
  for (let i = 0; i < productData.length; i++) {
    let item = productData[i]
    data.addRow([item.name, parseInt(item.total_sales)])
  }

  // Opciones de personalización del gráfico
  var options = {
    title: "Platillos más vendidos",
    width: 505,
    height: 400,
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
      filterColumnLabel: 'Cantidad de Platillos Vendidos',
      'ui': {'labelStacking': 'vertical'}
    }
  });

  // Invocación y utilización de la utilidad
  let calculadoTop5 = top5(productData)

  console.log(calculadoTop5)

  // Combina diferentes componentes gráficos y de control en un solo panel interactivo. 
  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container'));
  // establecer una relación de vinculación entre dos componentes
  dashboard.bind(control, chart);

  // Cambiar valores del control range
  changeRange = function() {
  // Le pasamos el valor mínimo y máximo calculado
  control.setState({'lowValue': calculadoTop5.minimo, 'highValue': calculadoTop5.maximo});
  control.draw();
  };

  // Reestablecer el valor por defecto
  changeDefaultRange = function() {
    control.clear();
    control.draw();
  }

  dashboard.draw(data);
  // Llamar a la función para el gráfico de empleados después de dibujar el gráfico de productos
  fetchDataAndDrawEmployeeChart();
}

/* ---------------- CHART 2 ----------------*/
function fetchDataAndDrawEmployeeChart() {
  fetch("/empleado")
    .then((response) => response.json())
    .then((employeeData) => {
      drawEmployeeChart(employeeData);
      console.info(employeeData)
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawEmployeeChart(employeeData) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Empleado");
  dataTable.addColumn("number", "Ventas");

   /* Ingresa la data de la response a -> data*/
   for (let i = 0; i < employeeData.length; i++) {
    let item = employeeData[i]
    dataTable.addRow([item.partner_name, parseInt(item.total_sales)])
  }

  var options = {
    title: "Empleados con Mayores Ventas",
    width: 480,
    height: 400,
    is3D: true,
    pieHole: 0.4, // Proporción del agujero central (0.4 significa un donut chart)
    colors: ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC"], // Colores personalizados para las partes del gráfico
  };

  
  var chartWrapper = new google.visualization.ChartWrapper({
    chartType: "PieChart",
    containerId: 'chart_div2',
    dataTable: dataTable,
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

  let calculadoTopEmpleados = top5(employeeData)

  console.log(calculadoTopEmpleados)
  changeEmpleados = function (){
    // Le pasamos el valor mínimo y máximo calculado
    control2.setState({'lowValue': calculadoTopEmpleados.minimo, 'highValue': calculadoTopEmpleados.maximo})
    control2.draw()
  }
  // Combina diferentes componentes gráficos y de control en un solo panel interactivo. 
  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container2'));
  // establecer una relación de vinculación entre dos componentes
  dashboard.bind(control2, chartWrapper);

  dashboard.draw(dataTable)
  // chart.draw(dataTable, options);
}
// Llamar a la función para el gráfico de productos
fetchDataAndDrawProductChart();

/* ---------------- Chart 3 ---------------- */
google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(fetchDataAndDrawGastosChart);

function fetchDataAndDrawGastosChart() {
  fetch("/ingresosgastos")
    .then((response) => response.json())
    .then((data) => {
      drawGastosChart(data)
      console.info(data)
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function drawGastosChart(gastosData) {

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Fecha');
  dataTable.addColumn('number', 'Ingresos');
  dataTable.addColumn('number', 'Gastos');
  
  // Agregar los datos a la tabla
  for (var i = 0; i < gastosData.length; i++) {
    var dataPoint = gastosData[i];
    var year = dataPoint.year;
    var month = dataPoint.month;
    var ingresos = parseFloat(dataPoint.ingresos);
    var gastos = parseFloat(dataPoint.gastos);
    // Crear una fecha al inicio del mes
    var date = new Date(year, month - 1, 1);
    var fecha = new Date(date);
    // console.log(date)
    dataTable.addRow([fecha, ingresos, gastos]);
  }

  
  var options = {
    title: 'Ingresos y Gastos',
    width: 470,
    height: 400,
    curveType: 'polynomial',
    legend: { position: 'bottom' },
    hAxis: {
      format: 'MMM yyyy'
    },
    vAxis: {
      format: 'Q#,##0.00 GTQ'
    }
  };

  var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'chart_div3',
    dataTable: dataTable,
    options: options
  });

  var rangeFilter = new google.visualization.ControlWrapper({
    controlType: 'ChartRangeFilter',
    containerId: 'control_div3',
    options: {
      filterColumnIndex: 0, // Índice de la columna que contiene las fechas
      filterColumnLabel: "test",
      ui: {
        chartType: 'LineChart',
        chartOptions: {
          height: 50,
          width: 470,
          chartArea: {
            width: '80%'
          },
          hAxis: {
            format: 'MMM yyyy'
          }
        }
      }
    }
  });

  // Establecer el rango inicial en el primer y último día del mes más antiguo
  var startDate = dataTable.getValue(0, 0);
  var endDate = dataTable.getValue(dataTable.getNumberOfRows() - 1, 0);
  rangeFilter.setState({ range: { start: startDate, end: endDate } });

  var dashboard = new google.visualization.Dashboard(document.getElementById('chart-container3'));

  dashboard.bind(rangeFilter, chart);
  dashboard.draw(dataTable);
}

fetchDataAndDrawGastosChart();
