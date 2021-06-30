
//   1. Use the D3 library to read in `samples.json`.
function buildPlot(id) {
  d3.json("samples.json").then(data =>{
    console.log(data);

  //   2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    //   * Use `sample_values` as the values for the bar chart.
    var filteredSample = data.samples.filter(fs => fs.id.toString() === id)[0];
    var sampleValue = filteredSample.sample_values.slice(0,10).reverse();
    console.log(sampleValue);

    //   * Use `otu_ids` as the labels for the bar chart.
    var ID = filteredSample.otu_ids.slice(0,10).reverse();
    console.log(ID);

    var otuID = ID.map(d => "OTU " + d);
    console.log(otuID);

    //   * Use `otu_labels` as the hovertext for the chart.
    var otuLabel = filteredSample.otu_labels.slice(0,10).reverse();
    console.log(otuLabel);

    var trace1 = {
      x: sampleValue,
      y: otuID,
      text: otuLabel,
      type: "bar",
      orientation: "h"
      };

    var dataPlot1 = [trace1];

    var layout = {
      title: `Top 10 OTUs for sample`
      };

    // Bar chart plot
      Plotly.newPlot("bar", dataPlot1, layout);

      
    //   3. Create a bubble chart that displays each sample.
    var trace2 = {
    //   * Use `otu_ids` for the x values.
      x: filteredSample.otu_ids,
    //   * Use `sample_values` for the y values.
      y: filteredSample.sample_values,
    //   * Use `sample_values` for the marker size.
    //   * Use `otu_ids` for the marker colors.
      mode: "markers",
      marker: {
        size: filteredSample.sample_values,
        color: filteredSample.otu_ids,
      },
    //   * Use `otu_labels` for the text values.
      text: filteredSample.otu_labels
    };

  // Bubble chart plot
    var dataPlot2 = [trace2];

    var layout = {
      title: 'A Bubble Chart for Sample',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
      yaxis: {
        title: {
          text: 'Sample Values',
        },
      },
      showlegend: false,
      height: 500,
      width: 1200
    };

    Plotly.newPlot('bubble', dataPlot2, layout);
    
  // Gauge Chart
    var washfreq = data.metadata.filter(wash => wash.id.toString() === id)[0];
    washfreq = washfreq.wfreq;

    var trace3 = [
      {  
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 2], color: "#ffffff" },
            { range: [2, 4], color: "#e6ffff" },
            { range: [4, 6], color: "#b3ffff" },
            { range: [6, 8], color: "#66ffff" },
            { range: [8, 9], color: "#00e6e6" }
    ]}
  }
];

    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', trace3, layout);

  });
};

  //   4. Display the sample metadata, i.e., an individual's demographic information.
  //   5. Display each key-value pair from the metadata JSON object somewhere on the page.
function demoInfo(id){
  d3.json("samples.json").then(data =>{
    console.log(data);

    var mdata = data.metadata;

    var demoInput = mdata.filter(md => md.id.toString() === id)[0];
    // Input data
    var sampleMeta = d3.select("#sample-metadata");
      
    // Clear the demographic info section before new input
    sampleMeta.html("");

    // Add the info 
    Object.entries(demoInput).forEach(key => {   
      sampleMeta.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
    });
  });
};


// This function is called when a dropdown menu item is selected
function init() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Use D3 to read data in 'samples.json'
  d3.json("samples.json").then(data =>{
    console.log(data);
    // Get Names from 'samples.json'
    data.names.forEach(name =>
      dropdownMenu.append("option").text(name).value);
      
    buildPlot(data.names[0]);
    demoInfo(data.names[0]);
  });

}

init();

  //   6. Update all of the plots any time that a new sample is selected.
function optionChanged(id) {
  buildPlot(id);
  demoInfo(id);
};


    
  



    
  
    
  