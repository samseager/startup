const VoteEndEvent = 'voteEnd';
const VoteStartEvent = 'voteStart';

class Vote{
    options;
    votes; 
    allowVote;
    constructor() {
        this.allowVote = false;
        this.configureWebSocket();
        const voterNameEl = document.querySelector('.voter-name');
        voterNameEl.textContent = this.getUserName();
    }
    async loadOptions() {
        this.votes = [0,0,0]
        const rowEl = document.querySelector('#cardRow');
        const response = await fetch('/api/movie');
        this.options = await response.json();

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
        
        this.broadcastEvent(this.getUserName(), VoteStartEvent, {});

    }

    incrementVote(button){
        if(this.allowVote){
            this.votes[button.id]++;
            const voteOP = document.getElementById("voteCount" + button.id);
            voteOP.textContent = "Votes : " + this.votes[button.id];
        }
    }

    getUserName(){
        return localStorage.getItem('userName') ?? 'Mystery player';
    }

    newVote(){
        if(this.allowVote === true){
            this.score()
        }
        this.allowVote = false;
        const rowEl = document.querySelector('#cardRow');
        rowEl.innerHTML = ""
        this.loadOptions();
    }

    newOptions(){
        this.allowVote = false;
        const rowEl = document.querySelector('#cardRow');
        rowEl.innerHTML = ""
        this.loadOptions();
    }

    async score(){
        const date = new Date().toLocaleDateString();
        var max = 0;
        var mIndex = 0;
        var ir = 0;
        var irc = [];
        for(let i = 0; i < this.votes.length; ++i){
            if (this.votes[i] > max){
                max = this.votes[i];
                mIndex = i;
                ir = 0;
                irc =[];
            }
            if(this.votes[i] === max){
                ir++
                irc.push(i);
            }
            else{
                ir = 0;
                irc = [];
            }
        }
        if(max === 0){
            mIndex = Math.floor(Math.random() * this.options.length);
        }
        else if(ir > 0){
            mIndex = irc[Math.floor(Math.random()* irc.length)];
        }
        const name = this.options[mIndex].name;
        const newResult = { name: name, votes: max, date: date };

        try {
            const response = await fetch('/api/result', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(newResult),
            });
      
            // this.broadcastEvent(this.getUserName(), VoteEndEvent, newResult);
      
            // Store what the service gave us as the high scores
            const results = await response.json();
            localStorage.setItem('results', JSON.stringify(results));
        } catch {
            // If there was an error then just track scores locally
            this.updateResultsLocal(newResult);
        }
        return;
    }

    updateResultsLocal(newResult) {
        let results = [];
        const resultText = localStorage.getItem('results');
        if (resultText) {
          results = JSON.parse(resultText);
        }
        let found = false;
        for (const [i, prevResult] of results.entries()) {
            if (newResult > prevResult.result) {
                results.splice(i, 0, newResult);
                found = true;
                break;
            }
        }
        if (!found) {
            results.push(newResult);
          }
      
          if (results.length > 10) {
            results.length = 10;
          }
      
          localStorage.setItem('results', JSON.stringify(results));
    }

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
        this.displayMsg('system', 'vote', 'connected');
        };
        this.socket.onclose = (event) => {
        this.displayMsg('system', 'vote', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        if (msg.type === VoteEndEvent) {
            this.displayMsg('voter', msg.from, `ended vote, winner ${msg.value.name}`);
        } else if (msg.type === VoteStartEvent) {
            this.displayMsg('voter', msg.from, `started a new vote`);
        }
        };
    }
    displayMsg(cls, from, msg) {
        const chatText = document.querySelector('#player-messages');
        chatText.innerHTML =
          `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
      }
    
      broadcastEvent(from, type, value) {
        const event = {
          from: from,
          type: type,
          value: value,
        };
        this.socket.send(JSON.stringify(event));
      }
}

const vote = new Vote();