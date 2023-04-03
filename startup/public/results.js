async function loadResults() {
  let results = [];
  try {
    // Get the latest high results from the service
    console.log("fetching results");
    const response = await fetch('/api/result');
    results = await response.json();
    console.log("fetched results")

    // Save the results in case we go offline in the future
    localStorage.setItem('results', JSON.stringify(results));
  } catch {
    // If there was an error then just use the last saved results
    const resultsText = localStorage.getItem('results');
    if (resultsText) {
      results = JSON.parse(resultsText);
    }
  }

  displayResults(results);
}

function displayResults(results) {
  const tableBodyEl = document.querySelector('#results');

  if (results.length) {
    // Update the DOM with the results
    for (const [i, result] of results.entries()) {
      const nameTdEl = document.createElement('td');
      const resultTdEl = document.createElement('td');
      const dateTdEl = document.createElement('td');

      nameTdEl.textContent = result.name;
      dateTdEl.textContent = result.date;
      resultTdEl.textContent = result.votes;

      const rowEl = document.createElement('tr');
      rowEl.appendChild(nameTdEl);
      rowEl.appendChild(resultTdEl);
      rowEl.appendChild(dateTdEl);

      tableBodyEl.appendChild(rowEl);
    }
  } else {
    tableBodyEl.innerHTML = '<tr><td colSpan=4>Be the first to vote</td></tr>';
  }
}

loadResults();
  
