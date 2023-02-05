# Startup
## Movie Rankings
#### Concept
If you have ever sat with a significant other or a group of friends and wanted to descied on what movie to watch look no further. The What To Watch? movie website provides 3 random choices from our list of clasics for you and your friends to vote on. Web sockets allow you and your friends to communicate before you get together and descide on what to watch. Once you all choose your prefered movie you can finally get to watching a show and no one can complain since they picked it.

![Mock](260-startup.jpg)
#### Features
- Secure login using authentication via HTTPS 
- Ability to start a vote and roll for random movies
- Displays choices of 3 movies
- Voters rank their choices
- Totals votes from all users in realtime
- Ability for a user to lock in their top three
- Results are stored
- Ability for admin to re roll movies if they dont like any of the choices

html href is super usefull 

3.13.218.29 elastic IP
Setting a Record on a Route 53 links the ip address to the domain name

edit caddy to allow for https access on the EC2 instance by SSH
sudo vi caddy 
sudo service caddy restart

ssh -i ~samuel/260.pem ubuntu@3.13.218.29
chmod  600 /Users/samuel/Downloads/260.pem
./deployWebsite.sh -k ~samuel/260.pem -h whatshouldwewatch.click