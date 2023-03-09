function loadResults() {
    let results = [];
    const resultsText = localStorage.getItem('results');
    if (resultsText) {
      results = JSON.parse(resultsText);
    }
    console.log(results);
    const tableBodyEl = document.getElementById('results');
  
    if (results.length) {
      for (const [i,result] of results.entries()) {
        const nameTdEl = document.createElement('td');
        const resultTdEl = document.createElement('td');
        const dateTdEl = document.createElement('td');
        console.log(result);
        nameTdEl.textContent = result.name;
        dateTdEl.textContent = result.date;
        resultTdEl.textContent = result.votes;
  
        const rowEl = document.createElement('tr');
        rowEl.appendChild(nameTdEl);
        rowEl.appendChild(dateTdEl);
        rowEl.appendChild(resultTdEl);
  
        tableBodyEl.appendChild(rowEl);
      }
    } else {
      tableBodyEl.innerHTML = '<tr><td colSpan=4>Be the first to result</td></tr>';
    }
  }
  
  loadResults();