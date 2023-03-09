class Vote{
    options;
    votes; 
    allowVote;
    constructor() {
        this.allowVote = false;
        this.loadOptions();
        const voterNameEl = document.querySelector('.voter-name');
        voterNameEl.textContent = this.getUserName();
    }
    loadOptions() {
        this.votes = [0,0,0]
        let options = [];
        const movies = new Set();
        const movie4 = {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb9ZSnTukIOXapVtDDPenYDtKVP_HVrygQ5A&usqp=CAU",
            name: "Interstellar",
            length: "2h 49m",
            descp: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            link: "https://www.imdb.com/title/tt0816692/?ref_=nv_sr_srsg_0"
        }
        const movie3 = {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIB_1AQva-z7WY3dFJI6SH9ITIPlhqeWdZvw&usqp=CAU",
            name: "Puss in Boots: The Last Wish",
            length: "1h 42m",
            descp: "Puss in Boots launches an epic journey to find the last wish",
            link: "https://www.imdb.com/title/tt3915174/?ref_=nv_sr_srsg_2",
        }
        const movie2 = {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_QCpEgd1O6PYyMS6nVR3NDy7PNAthMivIRA&usqp=CAU",
            name: "Black Panther",
            length: "2h 14m",
            descp: "The Black Panther fights to protect his people from a familiar enemy.",
            link: "https://www.imdb.com/title/tt1825683/?ref_=nv_sr_srsg_5",
        }
        const movie1 = {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQslYtT_6U-CpBuAdEzJey8eUBF8qeQrS-McQ&usqp=CAU",
            name: "Harry Potter and the Sorcerer's Stone",
            length: "2h 32m",
            descp: "An orphan enrolls in a school of wizardry and has adventures along the way.",
            link: "https://www.imdb.com/title/tt0241527/?ref_=nv_sr_srsg_0",
        }
        const movie0 = {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLuTj-JmJhfCm0_nHtQei7BHZV9DpiNj14HA&usqp=CAU",
            name: "Wedding Crashers",
            length: "1h 59m",
            descp: "Two wedding crashers are at odds after one falls in love.",
            link: "https://www.imdb.com/title/tt0396269/?ref_=nv_sr_srsg_0",
        }
        options.push(movie0);
        options.push(movie2);
        options.push(movie1);
        options.push(movie3);
        options.push(movie4);
        const rowEl = document.querySelector('#cardRow');
        while (movies.size < 3) {
            movies.add(options[Math.floor(Math.random() * options.length)]);
        }
        this.options = Array.from(movies);
        for (const [i, option] of this.options.entries()) {
            const coldEl = document.createElement('div');
            coldEl.className = "col-md-4";
            const cardEl = document.createElement('div');
            cardEl.className = "card";
            coldEl.style = "display: flex; flex-flow:column; height:inherit;"
            cardEl.style = "height:100%;"

            const imgEl = document.createElement('img');
            imgEl.className = "card-img-top";
            const cardBEl = document.createElement('div');
            cardBEl.className = "card-body";
            const titleH5El = document.createElement('h5');
            titleH5El.className = "card-title text-muted";
            const descpEl = document.createElement('p');
            const lenH4El = document.createElement('h4');
            lenH4El.className = "card-title text-muted";
            descpEl.className = "card-test text-muted";
            const voteEl = document.createElement('button');

            voteEl.className = "btn btn-primary";
            voteEl.textContent = "Vote";
            voteEl.id = i;
            voteEl.style = "margin-right : 10px;";
            voteEl.addEventListener('click', () => this.incrementVote(voteEl))
            const buttonDiv = document.createElement('div');

            const infoEl = document.createElement('a');
            infoEl.className = "btn btn-primary";
            infoEl.textContent = "Info";
            infoEl.target = "_blank"

            const voteCountEl = document.createElement('h3');
            voteCountEl.id = "voteCount" + i;
            voteCountEl.textContent = "Votes : 0";

            imgEl.src = option.img;
            titleH5El.textContent = option.name;
            lenH4El.textContent = option.length;
            descpEl.textContent = option.descp;
            infoEl.href = option.link;

            rowEl.appendChild(coldEl);
            coldEl.appendChild(cardEl);
            cardEl.appendChild(imgEl);
            cardEl.appendChild(cardBEl);
            cardBEl.appendChild(titleH5El);
            cardBEl.appendChild(lenH4El);
            cardBEl.appendChild(descpEl);
            cardBEl.appendChild(buttonDiv)
            buttonDiv.appendChild(voteEl);
            buttonDiv.appendChild(infoEl);
            coldEl.appendChild(document.createElement('br'));
            coldEl.appendChild(voteCountEl);
        }
        this.allowVote = true;
    }
    incrementVote(button){
        if(this.allowVote){
            this.votes[button.id]++;
            const voteOP = document.getElementById("voteCount" + button.id);
            voteOP.textContent = "Votes : " + this.votes[button.id];
            button.disabled = true;
        }
        
    }
    getUserName(){
        return localStorage.getItem('userName');
    }
    newVote(){
        this.allowVote = false;
        const rowEl = document.querySelector('#cardRow');
        this.score()
        rowEl.innerHTML = ""
        this.loadOptions();
    }
    newOptions(){
        this.allowVote = false;
        const rowEl = document.querySelector('#cardRow');
        rowEl.innerHTML = ""
        this.loadOptions();
    }
    score(){
        let results = [];
        const resultsText = localStorage.getItem('results');
        if (resultsText) {
          results = JSON.parse(resultsText);
        }

        const date = new Date().toLocaleDateString();
        var max = 0;
        var mIndex = 0
        for(let i = 0; i < this.votes.length; ++i){
            if (this.votes[i] > max){
                console.log(this.votes[i])
                max = this.votes[i];
                mIndex = i;
            }
        }
        if(max === 0){
            mIndex = Math.floor(Math.random() * this.options.length);
        }
        const name = this.options[mIndex].name;
        const newResult = { name: name, votes: max, date: date };

        results.push(newResult);

        if (results.length > 10) {
        results.length = 10;
        }
        localStorage.setItem('results', JSON.stringify(results));

        return;
    }
}
const vote = new Vote();